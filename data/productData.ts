import { Product } from '../types';

export const parseProductData = (text: string): Product[] => {
    const lines = text.split('\n');
    const products: Product[] = [];
    let currentCategory = 'Uncategorized';
    let currentSubCategory = 'Uncategorized';

    for (const line of lines) {
        if (!line.trim()) continue;

        const parts = line.split('\t').filter(p => p.trim());

        // Heuristic to detect category headers (usually all caps and single part)
        if (parts.length === 1 && parts[0] === parts[0].toUpperCase()) {
            currentCategory = parts[0].trim();
            currentSubCategory = 'Uncategorized'; // Reset sub-category
            continue;
        }
        
        // Heuristic for sub-category or multi-part header
        if (parts.length > 1 && / - WyreStorm/.test(parts[0])) {
             currentSubCategory = parts[0].replace(/ - WyreStorm/,'').trim();
             continue;
        }


        // Heuristic for a product line
        if (parts.length >= 2 && /^[A-Z0-9-]+$/.test(parts[0])) {
            const sku = parts[0].trim();
            // Description can contain quotes, clean them up
            const description = parts[1].replace(/"/g, '').trim();
            // Name is often part of the description
            const nameMatch = description.match(/^([^|]+)/);
            const name = nameMatch ? nameMatch[1].trim() : 'Unnamed Product';

            products.push({
                sku,
                name,
                description,
                category: currentCategory,
                subCategory: currentSubCategory,
            });
        }
    }

    return products;
};

// The raw text data provided by the user
export const MOCK_PRODUCT_DATA = `
WYRESTORM CONTROL SOLUTIONS	
Control System - WyreStorm	
COMP-1LIC	"	
Companion Control License for 1 Tablet"
COMP-3LIC	Companion Control License for 3 Tablets
COMP-6LIC	Companion Control License for 6 Tablets
TS-280-EU	2-Gang 2.8" Touchscreen Controller for Presentation Switcher Solutions
SYN-KEY10	Synergy™ 10-button Keypad Controller | Only comes with US back box
SYN-TOUCH10	Synergy™ 10.1” All-In-One Touchpad IP Controller | PoE+ | Table Top Stand & Wall-Mount (US/UK/EU Compatible)
SYN-CTL-HUB	Ethernet Protocol Converter for the SYN-TOUCH10 | RS232 | Relay | IR
NetworkHD Touch™	Free iPad & Android Control App for NetworkHD 100, 200 & 400 Series 
	
VIDEO PROCESSOR	
Video Processor - WyreStorm	
SW-0204-VW	4K 60Hz 4-Output Video Wall |  1x4, 2x2 layout |Ultra-wide resolution support  | WEB GUI and RS232 control 
SW-0206-VW	4K 60Hz 6-Output Video Wall |  Cascading up to 6 devices | Multi-fast layout and customized layout |Ultra-wide resolution support  | WEB GUI and RS232 control 
NHD-0401-MV	NetworkHD 4-Input 4K60 Multiview Switcher | Dolby Vision & HDR | Audio De-embed | Compatible with 400 & 500 Series
	
NETWORKHD H.264/H.265 (AV OVER IP)	
H.26x AV over IP - WyreStorm	
NHD-300-TX	1080p60Hz Live Streaming Encoder | PoE | RTSP, RTMP, HTTP | YouTube, Facebook, Wowza
NHD-120-TX	4K30Hz Encoder | PoE | Audio De-embed | IR & RS232 Routing
NHD-120-RX	4K30Hz Decoder | PoE | Audio De-embed | Video Wall | IR & RS232 Routing | CEC
NHD-120-IW-TX 	4K30Hz 2-Gang In-Wall Encoder | PoE | Audio De-embed | IR TX | 1GbE Port for 3rd Device Passthrough
NHD-124-TX	4K30Hz Quad Encoder
NHD-150-RX	4K30Hz Decoder | 4K60HZ Output | PoE | 9-Window Multiview Processing | Tile & Overlap Layout | Audio De-embed | RS232 | CEC
	
NETWORKHD 4K30Hz JPEG2000 (AV OVER IP) to NETWORKHD 4K60Hz 4:2:0 JPEG2000 (AV OVER IP) 	
NetworkHD AV over IP - WyreStorm	Discontinued Products - WyreStorm
NHD-400-E-TX	Lite 4K60Hz 4:2:0 Encoder | 1GbE | HDR | PoE | IR
NHD-400-E-RX	Lite 4K60Hz 4:2:0 Decoder | 1GbE | HDR | PoE | Video Wall | Mosaic | CEC | RS232
NHD-400-TX	4K60Hz 4:2:0  Encoder | 1GbE | HDR | PoE | USB 2.0 | Audio De-embed | HDMI Loop-Out | RS232 Routing
NHD-400-RX	4K60Hz 4:2:0 Decoder | 1GbE | HDR | PoE | USB 2.0 | Audio De-embed | Video Wall | Mosaic | CEC | RS232 Routing
	
NETWORKHD 4K60Hz JPEG2000 (AV OVER IP) to NETWORKHD 4K60Hz 4:4:4 JPEG2000 (AV OVER IP)	
Ultra Low Latency 4K over IP (1G) - WyreStorm	
NHD-500-E-TX	Lite 4K60Hz 4:4:4 Encoder | 1GbE | Dolby Vision & HDR | PoE | Audio De-embed | IR
NHD-500-E-RX	Lite 4K60Hz 4:4:4 Decoder | 1GbE | Dolby Vision & HDR | PoE | RS232
NHD-500-TX	4K60Hz 4:4:4 Encoder | 1GbE | Dolby Vision & HDR | PoE | USB 2.0 | Audio De-embed | ARC | S/PDIF | SFP | IR & RS232 Routing
NHD-500-RX	4K60Hz 4:4:4 Decoder | 1GbE | Dolby Vision & HDR | PoE | USB 2.0 | Video Wall | Audio De-embed | ARC | S/PDIF | SFP | CEC | IR & RS232 Routing
NHD-510-TX	4K60Hz 4:4:4 Encoder | 1GbE | HDMI&USB-C Input | HDMI Loop out | Dolby Vision & HDR | PoE+ | USB 2.0 | Audio De-embed | SFP | IR & RS232 Routing | Dante AV-A
NHD-500-DNT-TX	4K60Hz 4:4:4 Encoder | 2GbE RJ45 + SFP | Dolby Vision & HDR | PoE | USB 2.0 | Audio De-embed | Fiber | IR & RS232 Routing / Dante AES67
NHD-500-IW-TX	4K60Hz 4:4:4 2-Gang In-Wall Encoder | HDMI & USB-C Inputs | PoE | 1GbE | Dolby Vision & HDR | USB 2.0
	
NETWORKHD 4K60Hz SDVoE 10GbE (AV over IP)	
Lossless Zero Latency 4K60 over IP (10G) - WyreStorm	
NHD-600-TRX	4K60Hz 4:4:4 SDVoE Transceiver | 10G RJ45 | Dolby Vision & HDR | Video Wall | Multiview | PoE+ | Ethernet Passthrough | Audio De-embed | USB HID | IR & RS232
NHD-600-TRXF	4K60Hz 4:4:4 SDVoE Fiber Transceiver | 10G SFP+ | Dolby Vision & HDR | Video Wall | Multiview | Ethernet Passthrough | Audio De-embed | USB 2.0 | IR&RS232
NHD-610-TX-V2	4K60Hz 4:4:4 SDVoE Encoder | 10G RJ45 | Dolby Vision & HDR | PoE+ | Ethernet Passthrough | Audio De-embed | Dante/AES67 | USB HID | IR&RS232
NHD-610-TX	4K60Hz 4:4:4 SDVoE Encoder | 10G RJ45 | Dolby Vision & HDR | PoE+ | Ethernet Passthrough | Audio De-embed | Dante/AES67 | USB 2.0 | IR&RS232
NHD-610-RX	4K60Hz 4:4:4 SDVoE Decoder | 10G RJ45| Dolby Vision & HDR | Video Wall | Multiview | PoE+ | Ethernet Passthrough | Audio De-embed | USB 2.0 | IR&RS232
	
NETWORKHD COMPONENTS	
NetworkHD Components - WyreStorm	
NHD-CTL-PRO-V2	Pro Controller for NetworkHD Series | PoE | Dual NIC Network Isolation | Advanced Setup Interface & Wizard
NHD-USB-TRX	USB 2.0 over IP Transceiver | 1GbE | USB-A & USB-B Ports | SFP | PoE+ | USB Hub 
NHD-000-RACK4	6U/12 Slot Rack Mount for all NetworkHD Series
NHD-140-RACK-1U	1U/2 Slot Rack Mount for NHD-140-TX &NHD-124-TX Quad Encoder
NHD-RACK-1U	1U/2 Slot Rack Mount for NetworkHD™ 110/120/500/600/CTL
NHD-RACK4-BLK	Blanking Plate for NHD-000-RACK4
`;