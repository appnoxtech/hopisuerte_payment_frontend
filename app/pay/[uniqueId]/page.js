'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Dynamic Stripe initialized via component state on intent creation

import CustomDropdown from '@/components/CustomDropdown';

function UniqueProductPaymentContent() {

    const { uniqueId } = useParams();
    const searchParams = useSearchParams();

    const urlAmount = searchParams.get('amount');
    const urlCurrency = searchParams.get('currency');

    const [product, setProduct] = useState(null);
    const [amount, setAmount] = useState(urlAmount || '');
    const [currency, setCurrency] = useState(urlCurrency || 'USD');
    const [isCurrencyLocked, setIsCurrencyLocked] = useState(!!urlCurrency);
    const [isAmountPreFilled, setIsAmountPreFilled] = useState(!!urlAmount);

    const currencyOptions = [
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'XCG', value: 'XCG' }
    ];

    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });

    const [dialCode, setDialCode] = useState('+1');

    const countryDialOptions = [
        { label: 'United States (+1)', shortLabel: '+1', value: '+1', flag: 'us', searchTerms: 'us usa united states america' },
        { label: 'United Kingdom (+44)', shortLabel: '+44', value: '+44', flag: 'gb', searchTerms: 'uk gb britain england united kingdom' },
        { label: 'Canada (+1)', shortLabel: '+1', value: '+1', flag: 'ca', searchTerms: 'ca can canada' },
        { label: 'Australia (+61)', shortLabel: '+61', value: '+61', flag: 'au', searchTerms: 'au aus australia' },
        { label: 'India (+91)', shortLabel: '+91', value: '+91', flag: 'in', searchTerms: 'in ind india bharat' },
        { label: 'Germany (+49)', shortLabel: '+49', value: '+49', flag: 'de', searchTerms: 'de ger germany deutschland' },
        { label: 'France (+33)', shortLabel: '+33', value: '+33', flag: 'fr', searchTerms: 'fr fra france' },
        { label: 'Brazil (+55)', shortLabel: '+55', value: '+55', flag: 'br', searchTerms: 'br bra brazil' },
        { label: 'Mexico (+52)', shortLabel: '+52', value: '+52', flag: 'mx', searchTerms: 'mx mex mexico' },
        { label: 'Japan (+81)', shortLabel: '+81', value: '+81', flag: 'jp', searchTerms: 'jp jpn japan' },
        { label: 'China (+86)', shortLabel: '+86', value: '+86', flag: 'cn', searchTerms: 'cn chn china' },
        { label: 'Afghanistan (+93)', shortLabel: '+93', value: '+93', flag: 'af', searchTerms: 'af afg afghanistan' },
        { label: 'Albania (+355)', shortLabel: '+355', value: '+355', flag: 'al', searchTerms: 'al alb albania' },
        { label: 'Algeria (+213)', shortLabel: '+213', value: '+213', flag: 'dz', searchTerms: 'dz dza algeria' },
        { label: 'Andorra (+376)', shortLabel: '+376', value: '+376', flag: 'ad', searchTerms: 'ad and andorra' },
        { label: 'Angola (+244)', shortLabel: '+244', value: '+244', flag: 'ao', searchTerms: 'ao ago angola' },
        { label: 'Antarctica (+672)', shortLabel: '+672', value: '+672', flag: 'aq', searchTerms: 'aq ata antarctica' },
        { label: 'Antigua and Barbuda (+1)', shortLabel: '+1', value: '+1', flag: 'ag', searchTerms: 'ag atg antigua barbuda' },
        { label: 'Argentina (+54)', shortLabel: '+54', value: '+54', flag: 'ar', searchTerms: 'ar arg argentina' },
        { label: 'Armenia (+374)', shortLabel: '+374', value: '+374', flag: 'am', searchTerms: 'am arm armenia' },
        { label: 'Austria (+43)', shortLabel: '+43', value: '+43', flag: 'at', searchTerms: 'at aut austria' },
        { label: 'Azerbaijan (+994)', shortLabel: '+994', value: '+994', flag: 'az', searchTerms: 'az aze azerbaijan' },
        { label: 'Bahamas (+1)', shortLabel: '+1', value: '+1', flag: 'bs', searchTerms: 'bs bhs bahamas' },
        { label: 'Bahrain (+973)', shortLabel: '+973', value: '+973', flag: 'bh', searchTerms: 'bh bhr bahrain' },
        { label: 'Bangladesh (+880)', shortLabel: '+880', value: '+880', flag: 'bd', searchTerms: 'bd bgd bangladesh' },
        { label: 'Barbados (+1)', shortLabel: '+1', value: '+1', flag: 'bb', searchTerms: 'bb brb barbados' },
        { label: 'Belarus (+375)', shortLabel: '+375', value: '+375', flag: 'by', searchTerms: 'by blr belarus' },
        { label: 'Belgium (+32)', shortLabel: '+32', value: '+32', flag: 'be', searchTerms: 'be bel belgium' },
        { label: 'Belize (+501)', shortLabel: '+501', value: '+501', flag: 'bz', searchTerms: 'bz blz belize' },
        { label: 'Benin (+229)', shortLabel: '+229', value: '+229', flag: 'bj', searchTerms: 'bj ben benin' },
        { label: 'Bhutan (+975)', shortLabel: '+975', value: '+975', flag: 'bt', searchTerms: 'bt btn bhutan' },
        { label: 'Bolivia (+591)', shortLabel: '+591', value: '+591', flag: 'bo', searchTerms: 'bo bol bolivia' },
        { label: 'Bosnia and Herzegovina (+387)', shortLabel: '+387', value: '+387', flag: 'ba', searchTerms: 'ba bih bosnia' },
        { label: 'Botswana (+267)', shortLabel: '+267', value: '+267', flag: 'bw', searchTerms: 'bw bwa botswana' },
        { label: 'Brunei (+673)', shortLabel: '+673', value: '+673', flag: 'bn', searchTerms: 'bn brn brunei' },
        { label: 'Bulgaria (+359)', shortLabel: '+359', value: '+359', flag: 'bg', searchTerms: 'bg bgr bulgaria' },
        { label: 'Burkina Faso (+226)', shortLabel: '+226', value: '+226', flag: 'bf', searchTerms: 'bf bfa burkina faso' },
        { label: 'Burundi (+257)', shortLabel: '+257', value: '+257', flag: 'bi', searchTerms: 'bi bdi burundi' },
        { label: 'Cabo Verde (+238)', shortLabel: '+238', value: '+238', flag: 'cv', searchTerms: 'cv cpv cabo verde' },
        { label: 'Cambodia (+855)', shortLabel: '+855', value: '+855', flag: 'kh', searchTerms: 'kh khm cambodia' },
        { label: 'Cameroon (+237)', shortLabel: '+237', value: '+237', flag: 'cm', searchTerms: 'cm cmr cameroon' },
        { label: 'Central African Republic (+236)', shortLabel: '+236', value: '+236', flag: 'cf', searchTerms: 'cf caf central african republic' },
        { label: 'Chad (+235)', shortLabel: '+235', value: '+235', flag: 'td', searchTerms: 'td tcd chad' },
        { label: 'Chile (+56)', shortLabel: '+56', value: '+56', flag: 'cl', searchTerms: 'cl chl chile' },
        { label: 'Colombia (+57)', shortLabel: '+57', value: '+57', flag: 'co', searchTerms: 'co col colombia' },
        { label: 'Comoros (+269)', shortLabel: '+269', value: '+269', flag: 'km', searchTerms: 'km com comoros' },
        { label: 'Congo (+242)', shortLabel: '+242', value: '+242', flag: 'cg', searchTerms: 'cg cog congo' },
        { label: 'Costa Rica (+506)', shortLabel: '+506', value: '+506', flag: 'cr', searchTerms: 'cr cri costa rica' },
        { label: 'Croatia (+385)', shortLabel: '+385', value: '+385', flag: 'hr', searchTerms: 'hr hrv croatia' },
        { label: 'Cuba (+53)', shortLabel: '+53', value: '+53', flag: 'cu', searchTerms: 'cu cub cuba' },
        { label: 'Curaçao (+599)', shortLabel: '+599', value: '+599', flag: 'cw', searchTerms: 'cw cur curacao' },
        { label: 'Cyprus (+357)', shortLabel: '+357', value: '+357', flag: 'cy', searchTerms: 'cy cyp cyprus' },
        { label: 'Czech Republic (+420)', shortLabel: '+420', value: '+420', flag: 'cz', searchTerms: 'cz cze czech republic' },
        { label: 'Denmark (+45)', shortLabel: '+45', value: '+45', flag: 'dk', searchTerms: 'dk dnk denmark' },
        { label: 'Djibouti (+253)', shortLabel: '+253', value: '+253', flag: 'dj', searchTerms: 'dj dji djibouti' },
        { label: 'Dominica (+1)', shortLabel: '+1', value: '+1', flag: 'dm', searchTerms: 'dm dma dominica' },
        { label: 'Dominican Republic (+1)', shortLabel: '+1', value: '+1', flag: 'do', searchTerms: 'do dom dominican republic' },
        { label: 'Ecuador (+593)', shortLabel: '+593', value: '+593', flag: 'ec', searchTerms: 'ec ecu ecuador' },
        { label: 'Egypt (+20)', shortLabel: '+20', value: '+20', flag: 'eg', searchTerms: 'eg egy egypt' },
        { label: 'El Salvador (+503)', shortLabel: '+503', value: '+503', flag: 'sv', searchTerms: 'sv slv el salvador' },
        { label: 'Equatorial Guinea (+240)', shortLabel: '+240', value: '+240', flag: 'gq', searchTerms: 'gq gnq equatorial guinea' },
        { label: 'Eritrea (+291)', shortLabel: '+291', value: '+291', flag: 'er', searchTerms: 'er eri eritrea' },
        { label: 'Estonia (+372)', shortLabel: '+372', value: '+372', flag: 'ee', searchTerms: 'ee est estonia' },
        { label: 'Eswatini (+268)', shortLabel: '+268', value: '+268', flag: 'sz', searchTerms: 'sz swz swaziland' },
        { label: 'Ethiopia (+251)', shortLabel: '+251', value: '+251', flag: 'et', searchTerms: 'et eth ethiopia' },
        { label: 'Fiji (+679)', shortLabel: '+679', value: '+679', flag: 'fj', searchTerms: 'fj fji fiji' },
        { label: 'Finland (+358)', shortLabel: '+358', value: '+358', flag: 'fi', searchTerms: 'fi fin finland' },
        { label: 'Gabon (+241)', shortLabel: '+241', value: '+241', flag: 'ga', searchTerms: 'ga gab gabon' },
        { label: 'Gambia (+220)', shortLabel: '+220', value: '+220', flag: 'gm', searchTerms: 'gm gmb gambia' },
        { label: 'Georgia (+995)', shortLabel: '+995', value: '+995', flag: 'ge', searchTerms: 'ge geo georgia' },
        { label: 'Ghana (+233)', shortLabel: '+233', value: '+233', flag: 'gh', searchTerms: 'gh gha ghana' },
        { label: 'Greece (+30)', shortLabel: '+30', value: '+30', flag: 'gr', searchTerms: 'gr grc greece' },
        { label: 'Grenada (+1)', shortLabel: '+1', value: '+1', flag: 'gd', searchTerms: 'gd grd grenada' },
        { label: 'Guatemala (+502)', shortLabel: '+502', value: '+502', flag: 'gt', searchTerms: 'gt gtm guatemala' },
        { label: 'Guinea (+224)', shortLabel: '+224', value: '+224', flag: 'gn', searchTerms: 'gn gin guinea' },
        { label: 'Guinea-Bissau (+245)', shortLabel: '+245', value: '+245', flag: 'gw', searchTerms: 'gw gnb guinea-bissau' },
        { label: 'Guyana (+592)', shortLabel: '+592', value: '+592', flag: 'gy', searchTerms: 'gy guy guyana' },
        { label: 'Haiti (+509)', shortLabel: '+509', value: '+509', flag: 'ht', searchTerms: 'ht hti haiti' },
        { label: 'Honduras (+504)', shortLabel: '+504', value: '+504', flag: 'hn', searchTerms: 'hn hnd honduras' },
        { label: 'Hungary (+36)', shortLabel: '+36', value: '+36', flag: 'hu', searchTerms: 'hu hun hungary' },
        { label: 'Iceland (+354)', shortLabel: '+354', value: '+354', flag: 'is', searchTerms: 'is isl iceland' },
        { label: 'Indonesia (+62)', shortLabel: '+62', value: '+62', flag: 'id', searchTerms: 'id idn indonesia' },
        { label: 'Iran (+98)', shortLabel: '+98', value: '+98', flag: 'ir', searchTerms: 'ir irn iran' },
        { label: 'Iraq (+964)', shortLabel: '+964', value: '+964', flag: 'iq', searchTerms: 'iq irq iraq' },
        { label: 'Ireland (+353)', shortLabel: '+353', value: '+353', flag: 'ie', searchTerms: 'ie irl ireland' },
        { label: 'Israel (+972)', shortLabel: '+972', value: '+972', flag: 'il', searchTerms: 'il isr israel' },
        { label: 'Italy (+39)', shortLabel: '+39', value: '+39', flag: 'it', searchTerms: 'it ita italy' },
        { label: 'Jamaica (+1)', shortLabel: '+1', value: '+1', flag: 'jm', searchTerms: 'jm jam jamaica' },
        { label: 'Jordan (+962)', shortLabel: '+962', value: '+962', flag: 'jo', searchTerms: 'jo jor jordan' },
        { label: 'Kazakhstan (+7)', shortLabel: '+7', value: '+7', flag: 'kz', searchTerms: 'kz kaz kazakhstan' },
        { label: 'Kenya (+254)', shortLabel: '+254', value: '+254', flag: 'ke', searchTerms: 'ke ken kenya' },
        { label: 'Kiribati (+686)', shortLabel: '+686', value: '+686', flag: 'ki', searchTerms: 'ki kir kiribati' },
        { label: 'Kuwait (+965)', shortLabel: '+965', value: '+965', flag: 'kw', searchTerms: 'kw kwt kuwait' },
        { label: 'Kyrgyzstan (+996)', shortLabel: '+996', value: '+996', flag: 'kg', searchTerms: 'kg kgz kyrgyzstan' },
        { label: 'Laos (+856)', shortLabel: '+856', value: '+856', flag: 'la', searchTerms: 'la lao laos' },
        { label: 'Latvia (+371)', shortLabel: '+371', value: '+371', flag: 'lv', searchTerms: 'lv lva latvia' },
        { label: 'Lebanon (+961)', shortLabel: '+961', value: '+961', flag: 'lb', searchTerms: 'lb lbn lebanon' },
        { label: 'Lesotho (+266)', shortLabel: '+266', value: '+266', flag: 'ls', searchTerms: 'ls lso lesotho' },
        { label: 'Liberia (+231)', shortLabel: '+231', value: '+231', flag: 'lr', searchTerms: 'lr lbr liberia' },
        { label: 'Libya (+218)', shortLabel: '+218', value: '+218', flag: 'ly', searchTerms: 'ly lby libya' },
        { label: 'Liechtenstein (+423)', shortLabel: '+423', value: '+423', flag: 'li', searchTerms: 'li lie liechtenstein' },
        { label: 'Lithuania (+370)', shortLabel: '+370', value: '+370', flag: 'lt', searchTerms: 'lt ltu lithuania' },
        { label: 'Luxembourg (+352)', shortLabel: '+352', value: '+352', flag: 'lu', searchTerms: 'lu lux luxembourg' },
        { label: 'Madagascar (+261)', shortLabel: '+261', value: '+261', flag: 'mg', searchTerms: 'mg mdg madagascar' },
        { label: 'Malawi (+265)', shortLabel: '+265', value: '+265', flag: 'mw', searchTerms: 'mw mwi malawi' },
        { label: 'Malaysia (+60)', shortLabel: '+60', value: '+60', flag: 'my', searchTerms: 'my mys malaysia' },
        { label: 'Maldives (+960)', shortLabel: '+960', value: '+960', flag: 'mv', searchTerms: 'mv mdv maldives' },
        { label: 'Mali (+223)', shortLabel: '+223', value: '+223', flag: 'ml', searchTerms: 'ml mli mali' },
        { label: 'Malta (+356)', shortLabel: '+356', value: '+356', flag: 'mt', searchTerms: 'mt mlt malta' },
        { label: 'Marshall Islands (+692)', shortLabel: '+692', value: '+692', flag: 'mh', searchTerms: 'mh mhl marshall islands' },
        { label: 'Mauritania (+222)', shortLabel: '+222', value: '+222', flag: 'mr', searchTerms: 'mr mrt mauritania' },
        { label: 'Mauritius (+230)', shortLabel: '+230', value: '+230', flag: 'mu', searchTerms: 'mu mus mauritius' },
        { label: 'Micronesia (+691)', shortLabel: '+691', value: '+691', flag: 'fm', searchTerms: 'fm fsm micronesia' },
        { label: 'Moldova (+373)', shortLabel: '+373', value: '+373', flag: 'md', searchTerms: 'md mda moldova' },
        { label: 'Monaco (+377)', shortLabel: '+377', value: '+377', flag: 'mc', searchTerms: 'mc mco monaco' },
        { label: 'Mongolia (+976)', shortLabel: '+976', value: '+976', flag: 'mn', searchTerms: 'mn mng mongolia' },
        { label: 'Montenegro (+382)', shortLabel: '+382', value: '+382', flag: 'me', searchTerms: 'me mne montenegro' },
        { label: 'Morocco (+212)', shortLabel: '+212', value: '+212', flag: 'ma', searchTerms: 'ma mar morocco' },
        { label: 'Mozambique (+258)', shortLabel: '+258', value: '+258', flag: 'mz', searchTerms: 'mz moz mozambique' },
        { label: 'Myanmar (+95)', shortLabel: '+95', value: '+95', flag: 'mm', searchTerms: 'mm mmr myanmar' },
        { label: 'Namibia (+264)', shortLabel: '+264', value: '+264', flag: 'na', searchTerms: 'na nam namibia' },
        { label: 'Nauru (+674)', shortLabel: '+674', value: '+674', flag: 'nr', searchTerms: 'nr nru nauru' },
        { label: 'Nepal (+977)', shortLabel: '+977', value: '+977', flag: 'np', searchTerms: 'np npl nepal' },
        { label: 'Netherlands (+31)', shortLabel: '+31', value: '+31', flag: 'nl', searchTerms: 'nl nld netherlands' },
        { label: 'New Zealand (+64)', shortLabel: '+64', value: '+64', flag: 'nz', searchTerms: 'nz nzl new zealand' },
        { label: 'Nicaragua (+505)', shortLabel: '+505', value: '+505', flag: 'ni', searchTerms: 'ni nic nicaragua' },
        { label: 'Niger (+227)', shortLabel: '+227', value: '+227', flag: 'ne', searchTerms: 'ne ner niger' },
        { label: 'Nigeria (+234)', shortLabel: '+234', value: '+234', flag: 'ng', searchTerms: 'ng nga nigeria' },
        { label: 'North Korea (+850)', shortLabel: '+850', value: '+850', flag: 'kp', searchTerms: 'kp prk north korea' },
        { label: 'North Macedonia (+389)', shortLabel: '+389', value: '+389', flag: 'mk', searchTerms: 'mk mkd north macedonia' },
        { label: 'Norway (+47)', shortLabel: '+47', value: '+47', flag: 'no', searchTerms: 'no nor norway' },
        { label: 'Oman (+968)', shortLabel: '+968', value: '+968', flag: 'om', searchTerms: 'om omn oman' },
        { label: 'Pakistan (+92)', shortLabel: '+92', value: '+92', flag: 'pk', searchTerms: 'pk pak pakistan' },
        { label: 'Palau (+680)', shortLabel: '+680', value: '+680', flag: 'pw', searchTerms: 'pw plw palau' },
        { label: 'Palestine (+970)', shortLabel: '+970', value: '+970', flag: 'ps', searchTerms: 'ps pse palestine' },
        { label: 'Panama (+507)', shortLabel: '+507', value: '+507', flag: 'pa', searchTerms: 'pa pan panama' },
        { label: 'Papua New Guinea (+675)', shortLabel: '+675', value: '+675', flag: 'pg', searchTerms: 'pg png papua new guinea' },
        { label: 'Paraguay (+595)', shortLabel: '+595', value: '+595', flag: 'py', searchTerms: 'py pry paraguay' },
        { label: 'Peru (+51)', shortLabel: '+51', value: '+51', flag: 'pe', searchTerms: 'pe per peru' },
        { label: 'Philippines (+63)', shortLabel: '+63', value: '+63', flag: 'ph', searchTerms: 'ph phl philippines' },
        { label: 'Poland (+48)', shortLabel: '+48', value: '+48', flag: 'pl', searchTerms: 'pl pol poland' },
        { label: 'Portugal (+351)', shortLabel: '+351', value: '+351', flag: 'pt', searchTerms: 'pt prt portugal' },
        { label: 'Qatar (+974)', shortLabel: '+974', value: '+974', flag: 'qa', searchTerms: 'qa qat qatar' },
        { label: 'Romania (+40)', shortLabel: '+40', value: '+40', flag: 'ro', searchTerms: 'ro rou romania' },
        { label: 'Russia (+7)', shortLabel: '+7', value: '+7', flag: 'ru', searchTerms: 'ru rus russia' },
        { label: 'Rwanda (+250)', shortLabel: '+250', value: '+250', flag: 'rw', searchTerms: 'rw rwa rwanda' },
        { label: 'Saint Kitts and Nevis (+1)', shortLabel: '+1', value: '+1', flag: 'kn', searchTerms: 'kn kna saint kitts nevis' },
        { label: 'Saint Lucia (+1)', shortLabel: '+1', value: '+1', flag: 'lc', searchTerms: 'lc lca saint lucia' },
        { label: 'Saint Vincent and the Grenadines (+1)', shortLabel: '+1', value: '+1', flag: 'vc', searchTerms: 'vc vct saint vincent grenadines' },
        { label: 'Samoa (+685)', shortLabel: '+685', value: '+685', flag: 'ws', searchTerms: 'ws wsm samoa' },
        { label: 'San Marino (+378)', shortLabel: '+378', value: '+378', flag: 'sm', searchTerms: 'sm smr san marino' },
        { label: 'Sao Tome and Principe (+239)', shortLabel: '+239', value: '+239', flag: 'st', searchTerms: 'st stp sao tome principe' },
        { label: 'Saudi Arabia (+966)', shortLabel: '+966', value: '+966', flag: 'sa', searchTerms: 'sa sau saudi arabia' },
        { label: 'Senegal (+221)', shortLabel: '+221', value: '+221', flag: 'sn', searchTerms: 'sn sen senegal' },
        { label: 'Serbia (+381)', shortLabel: '+381', value: '+381', flag: 'rs', searchTerms: 'rs srb serbia' },
        { label: 'Seychelles (+248)', shortLabel: '+248', value: '+248', flag: 'sc', searchTerms: 'sc syc seychelles' },
        { label: 'Sierra Leone (+232)', shortLabel: '+232', value: '+232', flag: 'sl', searchTerms: 'sl sle sierra leone' },
        { label: 'Singapore (+65)', shortLabel: '+65', value: '+65', flag: 'sg', searchTerms: 'sg sgp singapore' },
        { label: 'Slovakia (+421)', shortLabel: '+421', value: '+421', flag: 'sk', searchTerms: 'sk svk slovakia' },
        { label: 'Slovenia (+386)', shortLabel: '+386', value: '+386', flag: 'si', searchTerms: 'si svn slovenia' },
        { label: 'Solomon Islands (+677)', shortLabel: '+677', value: '+677', flag: 'sb', searchTerms: 'sb slb solomon islands' },
        { label: 'Somalia (+252)', shortLabel: '+252', value: '+252', flag: 'so', searchTerms: 'so som somalia' },
        { label: 'South Sudan (+211)', shortLabel: '+211', value: '+211', flag: 'ss', searchTerms: 'ss ssd south sudan' },
        { label: 'Spain (+34)', shortLabel: '+34', value: '+34', flag: 'es', searchTerms: 'es esp spain' },
        { label: 'Sri Lanka (+94)', shortLabel: '+94', value: '+94', flag: 'lk', searchTerms: 'lk lka sri lanka' },
        { label: 'Sudan (+249)', shortLabel: '+249', value: '+249', flag: 'sd', searchTerms: 'sd sdn sudan' },
        { label: 'Suriname (+597)', shortLabel: '+597', value: '+597', flag: 'sr', searchTerms: 'sr sur suriname' },
        { label: 'Sweden (+46)', shortLabel: '+46', value: '+46', flag: 'se', searchTerms: 'se swe sweden' },
        { label: 'Switzerland (+41)', shortLabel: '+41', value: '+41', flag: 'ch', searchTerms: 'ch che switzerland' },
        { label: 'Syria (+963)', shortLabel: '+963', value: '+963', flag: 'sy', searchTerms: 'sy syr syria' },
        { label: 'Taiwan (+886)', shortLabel: '+886', value: '+886', flag: 'tw', searchTerms: 'tw twn taiwan' },
        { label: 'Tajikistan (+992)', shortLabel: '+992', value: '+992', flag: 'tj', searchTerms: 'tj tjk tajikistan' },
        { label: 'Tanzania (+255)', shortLabel: '+255', value: '+255', flag: 'tz', searchTerms: 'tz tza tanzania' },
        { label: 'Thailand (+66)', shortLabel: '+66', value: '+66', flag: 'th', searchTerms: 'th tha thailand' },
        { label: 'Timor-Leste (+670)', shortLabel: '+670', value: '+670', flag: 'tl', searchTerms: 'tl tls timor-leste' },
        { label: 'Togo (+228)', shortLabel: '+228', value: '+228', flag: 'tg', searchTerms: 'tg tgo togo' },
        { label: 'Tonga (+676)', shortLabel: '+676', value: '+676', flag: 'to', searchTerms: 'to ton tonga' },
        { label: 'Trinidad and Tobago (+1)', shortLabel: '+1', value: '+1', flag: 'tt', searchTerms: 'tt tto trinidad tobago' },
        { label: 'Tunisia (+216)', shortLabel: '+216', value: '+216', flag: 'tn', searchTerms: 'tn tun tunisia' },
        { label: 'Turkey (+90)', shortLabel: '+90', value: '+90', flag: 'tr', searchTerms: 'tr tur turkey' },
        { label: 'Turkmenistan (+993)', shortLabel: '+993', value: '+993', flag: 'tm', searchTerms: 'tm tkm turkmenistan' },
        { label: 'Tuvalu (+688)', shortLabel: '+688', value: '+688', flag: 'tv', searchTerms: 'tv tuv tuvalu' },
        { label: 'Uganda (+256)', shortLabel: '+256', value: '+256', flag: 'ug', searchTerms: 'ug uga uganda' },
        { label: 'Ukraine (+380)', shortLabel: '+380', value: '+380', flag: 'ua', searchTerms: 'ua ukr ukraine' },
        { label: 'United Arab Emirates (+971)', shortLabel: '+971', value: '+971', flag: 'ae', searchTerms: 'ae are united arab emirates' },
        { label: 'Uruguay (+598)', shortLabel: '+598', value: '+598', flag: 'uy', searchTerms: 'uy ury uruguay' },
        { label: 'Uzbekistan (+998)', shortLabel: '+998', value: '+998', flag: 'uz', searchTerms: 'uz uzb uzbekistan' },
        { label: 'Vanuatu (+678)', shortLabel: '+678', value: '+678', flag: 'vu', searchTerms: 'vu vut vanuatu' },
        { label: 'Vatican City (+379)', shortLabel: '+379', value: '+379', flag: 'va', searchTerms: 'va vat vatican' },
        { label: 'Venezuela (+58)', shortLabel: '+58', value: '+58', flag: 've', searchTerms: 've ven venezuela' },
        { label: 'Vietnam (+84)', shortLabel: '+84', value: '+84', flag: 'vn', searchTerms: 'vn vnm vietnam' },
        { label: 'Yemen (+967)', shortLabel: '+967', value: '+967', flag: 'ye', searchTerms: 'ye yem yemen' },
        { label: 'Zambia (+260)', shortLabel: '+260', value: '+260', flag: 'zm', searchTerms: 'zm zmb zambia' },
        { label: 'Zimbabwe (+263)', shortLabel: '+263', value: '+263', flag: 'zw', searchTerms: 'zw zwe zimbabwe' }
    ];

    const [clientSecret, setClientSecret] = useState(null);
    const [stripePromise, setStripePromise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [feePercentage, setFeePercentage] = useState(10);

    useEffect(() => {
        if (!uniqueId) return;

        api.get(`/product/link/${uniqueId}`)
            .then(res => {
                const data = res.data.product ? res.data : { product: res.data, prefilled_currency: null };
                setProduct(data.product);
                if (data.prefilled_currency) {
                    setCurrency(data.prefilled_currency);
                    setIsCurrencyLocked(true);
                }
                if (data.fee_percentage) {
                    setFeePercentage(data.fee_percentage);
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Product not found or link expired.');
                setLoading(false);
            });

    }, [uniqueId]);

    const handleStartPayment = async (e) => {
        e.preventDefault();

        if (!product || !amount || isNaN(amount) || parseFloat(amount) < 0.50) {
            alert("Amount must be greater than 0.50");
            return;
        }

        if (!customer.phone) {
            alert("Phone number is required");
            return;
        }

        setSubmitting(true);

        try {
            const res = await api.post('/payments/intent', {
                product_id: product.id,
                amount: parseFloat(amount),
                currency: currency.toUpperCase(),
                customer_name: customer.name,
                customer_email: customer.email,
                customer_phone: customer.phone ? `${dialCode}${customer.phone}` : '',
                notes: customer.notes
            });

            setClientSecret(res.data.clientSecret);
            const accountId = res.data.stripe_account || 1;
            const pk = accountId === 2
                ? process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_2_KEY
                : process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_1_KEY;

            setStripePromise(loadStripe(pk));

        } catch {
            alert("Payment initialization failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={msgStyle}>Loading payment portal...</div>;
    if (error) return <div style={{ ...msgStyle, color: '#ef4444' }}>{error}</div>;

    return (
        <main style={mainStyle}>

            <div style={glowStyle} />

            {/* Back Button - Top Left of Screen */}
            <div style={{ position: 'absolute', left: 40, top: 40, zIndex: 50 }}>
                {clientSecret ? (
                    <button onClick={() => setClientSecret(null)} style={backLinkStyle} type="button">
                        <ArrowLeft size={14} />
                        Back
                    </button>
                ) : (
                    <Link href="/" style={backLinkStyle}>
                        <ArrowLeft size={14} />
                        Back
                    </Link>
                )}
            </div>

            <div style={{ width: '100%', maxWidth: 640, position: 'relative', zIndex: 10 }}>

                {/* Card */}
                <div style={cardStyle}>
                    <div style={{ marginBottom: 28, textAlign: 'center' }}>
                        {product?.image_url && (
                            <div style={{ marginBottom: 20 }}>
                                <img src={product.image_url} alt={product.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '16px', margin: '0 auto', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                            </div>
                        )}
                        <h1 className="gradient-text" style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.02em', fontFamily: "'Outfit', sans-serif" }}>
                            Complete Your Payment
                        </h1>
                        <p style={{ color: '#6B7C93', fontSize: '15px', marginBottom: product?.notes ? '8px' : '20px' }}>
                            {product ? product.name : 'Secure Transaction'}
                        </p>
                        {product?.notes && (
                            <p style={{ color: '#4b5563', fontSize: '13px', marginBottom: '20px', fontStyle: 'italic' }}>
                                Note: {product.notes}
                            </p>
                        )}

                        {/* Merchant Identity */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '6px 16px',
                            background: '#F7F9FC',
                            borderRadius: '20px',
                            border: '1px solid #E3E8EF',
                        }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '8px',
                                background: '#0070E0',
                                color: '#FFF',
                                fontSize: '12px',
                                fontWeight: '800',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                {product?.user?.profile_image_url ? (
                                    <img src={product.user.profile_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    product?.user?.name?.[0]?.toUpperCase() || 'M'
                                )}
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#1A1F36' }}>
                                Payable to {product?.user?.name || 'Authorized Merchant'}
                            </span>
                        </div>
                    </div>

                    {!clientSecret ? (

                        <form onSubmit={handleStartPayment}>

                            {/* Amount - only show if not pre-filled from home page */}
                            {!isAmountPreFilled && (
                                <div style={{ marginBottom: 20 }}>
                                    <label style={labelStyle}>Amount</label>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <span style={currencySymbol}>
                                                {currency === 'EUR' ? '€' : (currency === 'XCG' ? 'Cg' : '$')}
                                            </span>
                                            <input
                                                type="number"
                                                min="0.50"
                                                step="0.01"
                                                required
                                                placeholder="0.00"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                style={{ ...inputStyle, paddingLeft: 38 }}
                                            />
                                        </div>
                                        <div style={{ width: 100, opacity: isCurrencyLocked ? 0.6 : 1, pointerEvents: isCurrencyLocked ? 'none' : 'auto' }}>
                                            <CustomDropdown
                                                options={currencyOptions}
                                                value={currency}
                                                onChange={(val) => setCurrency(val)}
                                                showSearch={false}
                                                placeholder="USD"
                                            />
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '8px', fontSize: '13px', color: '#0070E0', fontWeight: '500' }}>
                                        A {feePercentage}% exchange and processing fee will be added to your total amount.
                                    </div>
                                </div>
                            )}

                            {/* Customer */}
                            <div style={{ marginBottom: 20 }}>

                                <label style={labelStyle}>Your Details</label>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                                    <input
                                        style={inputStyle}
                                        placeholder="Full Name"
                                        required
                                        value={customer.name}
                                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                    />

                                    <input
                                        style={inputStyle}
                                        type="email"
                                        required
                                        placeholder="Email Address"
                                        value={customer.email}
                                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                    />

                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <div style={{ width: 110 }}>
                                            <CustomDropdown
                                                options={countryDialOptions}
                                                value={dialCode}
                                                onChange={(val) => setDialCode(val)}
                                                showSearch={true}
                                                placeholder="+1"
                                            />
                                        </div>
                                        <input
                                            style={{ ...inputStyle, flex: 1 }}
                                            placeholder="Phone Number"
                                            required
                                            value={customer.phone}
                                            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                        />
                                    </div>

                                    <textarea
                                        rows={2}
                                        style={{ ...inputStyle, resize: 'none' }}
                                        placeholder="Notes (Optional)"
                                        value={customer.notes}
                                        onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                                    />

                                </div>
                            </div>

                            {/* Payment Summary Breakdown */}
                            {amount && !isNaN(amount) && parseFloat(amount) > 0 && (
                                <div style={{ marginBottom: 24, padding: '16px 20px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1E293B', fontWeight: '700' }}>Payment Summary</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: 8, color: '#475569' }}>
                                        <span>Entered Amount:</span>
                                        <span style={{ fontWeight: '500' }}>{currency} {parseFloat(amount).toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: 16, color: '#475569' }}>
                                        <span>Processing Fee:</span>
                                        <span style={{ fontWeight: '500' }}>{currency} {(parseFloat(amount) * (feePercentage / 100)).toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', paddingTop: 16, borderTop: '1px solid #CBD5E1', color: '#0F172A', fontWeight: '800' }}>
                                        <span>Total Payable Amount:</span>
                                        <span>{currency} {(parseFloat(amount) * (1 + feePercentage / 100)).toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Button */}
                            <button
                                type="submit"
                                disabled={submitting || !amount}
                                style={submitStyle}
                            >
                                {submitting
                                    ? "Processing..."
                                    : `Pay ${amount ? (parseFloat(amount) * 1.1).toFixed(2) : '0.00'} ${currency}`
                                }
                            </button>

                        </form>

                    ) : (

                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <CheckoutForm amount={amount} currency={currency} />
                        </Elements>

                    )}

                </div>

            </div>

        </main>
    );
}

export default function UniqueProductPaymentPage() {
    return (
        <Suspense fallback={<div style={msgStyle}>Loading payment portal...</div>}>
            <UniqueProductPaymentContent />
        </Suspense>
    );
}

/* ---------------- STYLES ---------------- */

const mainStyle = {
    minHeight: '100vh',
    background: '#F7F9FC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    fontFamily: '"Inter", sans-serif',
    overflow: 'hidden'
};

const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    borderRadius: 24,
    padding: '40px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#001c64',
    marginBottom: 8,
    display: 'block'
};

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    borderRadius: 12,
    color: '#1A1F36',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
};

const currencySymbol = {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6B7C93',
    fontWeight: '600',
    fontSize: '15px',
    zIndex: 1
};

const submitStyle = {
    width: '100%',
    marginTop: 12,
    padding: '16px',
    background: '#0070E0',
    color: '#FFFFFF',
    borderRadius: 12,
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)'
};

const glowStyle = {
    position: 'absolute',
    top: -150,
    left: -150,
    width: 600,
    height: 600,
    background: 'radial-gradient(circle, rgba(0, 112, 224, 0.08) 0%, rgba(247, 249, 252, 0) 70%)',
    borderRadius: '50%',
    zIndex: 1
};

const msgStyle = {
    textAlign: 'center',
    color: '#001c64',
    fontSize: 18,
    fontWeight: 600,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F7F9FC'
};

const backLinkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#6B7C93',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    padding: '10px 16px',
    background: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E3E8EF',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
};