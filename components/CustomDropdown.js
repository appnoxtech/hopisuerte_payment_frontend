'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
    const [menuStyles, setMenuStyles] = useState({});
    const dropdownRef = useRef(null);

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

    // Close when clicking outside and handle position calc
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const preferredMaxHeight = 350;
            const minSpaceNeeded = 200;

            let newStyles = {
                maxHeight: `min(${preferredMaxHeight}px, 60vh)`
            };

            // If not enough space below, try opening upwards
            if (spaceBelow < minSpaceNeeded && spaceAbove > spaceBelow) {
                newStyles.bottom = 'calc(100% + 4px)';
                newStyles.top = 'auto';
                newStyles.maxHeight = `min(${preferredMaxHeight}px, ${spaceAbove - 20}px)`;
            } else {
                newStyles.top = 'calc(100% + 4px)';
                newStyles.bottom = 'auto';
                newStyles.maxHeight = `min(${preferredMaxHeight}px, ${spaceBelow - 20}px)`;
            }
            setMenuStyles(newStyles);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleSelect = (option) => {
        if (onChange) onChange(option.value);
        setIsOpen(false);
        setSearchQuery("");
    };

    return (
        <div
            ref={dropdownRef}
            className={`relative w-full ${className}`}
            style={{ ...containerStyle, ...style }}
        >
            {/* Label/Toggle */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    ...toggleStyle,
                    borderColor: isOpen ? 'var(--primary, #facc15)' : 'rgba(255,255,255,0.08)',
                    boxShadow: isOpen ? 'var(--primary-glow, 0 0 0 1px rgba(250,204,21,0.2))' : 'none'
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
                    size={18}
                    style={{
                        color: '#71717a',
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease'
                    }}
                />
            </div>

            {/* Menu */}
            {isOpen && (
                <div style={{ ...menuStyle, ...menuStyles }}>
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
                                        background: value === opt.value ? 'var(--primary-glow, rgba(250,204,21,0.1))' : 'transparent',
                                        color: value === opt.value ? 'var(--primary, #facc15)' : '#fff'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (value !== opt.value) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (value !== opt.value) e.currentTarget.style.background = 'transparent';
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
            )}
        </div>
    );
}

const containerStyle = {
    position: 'relative'
};

const toggleStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '12px 14px',
    background: 'var(--bg-main, #09090b)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none'
};

const menuStyle = {
    position: 'absolute',
    left: 0,
    right: 0,
    background: 'var(--bg-card, #121214)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12,
    zIndex: 1000,
    boxShadow: 'var(--shadow-xl)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    animation: 'fadeIn 0.15s ease-out'
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

const optionsListStyle = {
    overflowY: 'auto',
    padding: '4px',
    flex: 1
};

const optionStyle = {
    padding: '10px 12px',
    fontSize: 14,
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const noResultsStyle = {
    padding: '16px',
    textAlign: 'center',
    color: '#71717a',
    fontSize: 13
};
