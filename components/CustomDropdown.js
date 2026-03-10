'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';

export default function CustomDropdown({
    options = [],
    value,
    onChange,
    placeholder = "Select option",
    showSearch = true,
    className = "",
    style = {}
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [portalCoords, setPortalCoords] = useState({ top: 0, left: 0, width: 0, direction: 'down' });
    const dropdownRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const selectedOption = useMemo(() =>
        options.find(opt => opt.value === value),
        [options, value]
    );

    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        return options.filter(opt =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

    // Calculate position taking viewport into account
    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const minSpaceNeeded = 250;

            let direction = 'down';
            // Coordinates for fixed positioning (relative to viewport)
            let top = rect.bottom + 4;

            if (spaceBelow < minSpaceNeeded && spaceAbove > spaceBelow) {
                direction = 'up';
                top = rect.top - 4;
            }

            setPortalCoords({
                top,
                left: rect.left,
                width: rect.width,
                direction,
                maxHeight: direction === 'down' ? Math.min(400, spaceBelow - 20) : Math.min(400, spaceAbove - 20)
            });
        }

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                const portalMenu = document.getElementById('dropdown-portal-menu');
                if (portalMenu && portalMenu.contains(event.target)) return;
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            window.addEventListener("scroll", () => setIsOpen(false), { capture: true, once: true });
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (option) => {
        if (onChange) onChange(option.value);
        setIsOpen(false);
        setSearchQuery("");
    };

    const menuContent = (
        <div
            id="dropdown-portal-menu"
            style={{
                ...menuWrapperStyle,
                position: 'fixed',
                top: portalCoords.top,
                left: portalCoords.left,
                width: portalCoords.width,
                maxHeight: portalCoords.maxHeight,
                transform: portalCoords.direction === 'up' ? 'translateY(-100%)' : 'none',
                zIndex: 10000, // Extremely high
                animation: 'fadeIn 0.1s ease-out'
            }}
        >
            {showSearch && (
                <div style={searchContainerStyle}>
                    <Search size={14} style={{ color: '#71717a' }} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        style={searchInputStyle}
                    />
                    {searchQuery && (
                        <X
                            size={14}
                            style={{ color: '#71717a', cursor: 'pointer' }}
                            onClick={() => setSearchQuery("")}
                        />
                    )}
                </div>
            )}

            <div style={optionsListStyle}>
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => handleSelect(opt)}
                            style={{
                                ...optionStyle,
                                background: value === opt.value ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
                                color: value === opt.value ? '#fbbf24' : '#fff'
                            }}
                        >
                            {opt.label}
                        </div>
                    ))
                ) : (
                    <div style={noResultsStyle}>No results found</div>
                )}
            </div>
        </div>
    );

    return (
        <div
            ref={dropdownRef}
            className={`relative w-full ${className}`}
            style={{ ...containerStyle, ...style }}
        >
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    ...toggleStyle,
                    borderColor: isOpen ? '#facc15' : 'rgba(255,255,255,0.08)',
                }}
            >
                <span style={{
                    color: selectedOption ? '#fff' : '#71717a',
                    fontSize: 14,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    style={{
                        color: '#71717a',
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease'
                    }}
                />
            </div>

            {isOpen && mounted && createPortal(menuContent, document.body)}
        </div>
    );
}

const containerStyle = { position: 'relative' };
const toggleStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '10px 14px',
    background: '#09090b',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none'
};

const menuWrapperStyle = {
    position: 'absolute',
    background: '#121214',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    zIndex: 9999,
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
};

const searchContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    gap: 8,
    flexShrink: 0
};

const searchInputStyle = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: 14,
    width: '100%'
};

const optionsListStyle = { overflowY: 'auto', padding: '4px', flex: 1 };
const optionStyle = {
    padding: '10px 12px',
    fontSize: 13,
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '600'
};

const noResultsStyle = { padding: '16px', textAlign: 'center', color: '#71717a', fontSize: 13 };
