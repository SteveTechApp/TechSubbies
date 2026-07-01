import type { ItSkillProfile } from "../types/itSkillProfiles";

export const itSkillProfiles: ItSkillProfile[] = [
  {
    "id": "free-basic-it-support-technician",
    "title": "Free Basic IT Support Technician",
    "planLevel": "free-basic",
    "category": "support",
    "summary": "Entry-level IT support profile for people with practical exposure to basic end-user support, Windows or macOS devices, common cables, peripherals, user accounts, Microsoft 365 basics and supervised troubleshooting.",
    "suitableFor": [
      "Basic IT support assistance",
      "First-line helpdesk support under supervision",
      "Desktop setup assistance",
      "Printer/peripheral support assistance",
      "Meeting-room IT handover support",
      "Basic device staging"
    ],
    "mustHaveSummary": [
      "Can identify common IT cables, ports and peripherals",
      "Understands basic computer, user account and network concepts",
      "Can follow a support ticket, checklist or instruction from a senior technician",
      "Can record symptoms, actions taken and escalation notes clearly",
      "Can work safely and professionally with end users"
    ],
    "niceToHaveSummary": [
      "Basic Microsoft 365 awareness",
      "Basic Windows 10/11 or macOS support exposure",
      "Basic IP address, Wi-Fi and patching awareness",
      "Basic MFA/password reset process awareness",
      "Exposure to recognised IT brands or platforms"
    ],
    "expectedKnowledge": [
      "Windows and/or macOS desktop basics",
      "User accounts, passwords and MFA at a basic level",
      "Common ports and cables: USB-A, USB-C, HDMI, DisplayPort, Ethernet and power",
      "Basic network terms: Wi-Fi, Ethernet, IP address, router, switch, access point",
      "Basic support workflow: ticket, priority, notes, escalation, resolution"
    ],
    "roleAspects": [
      {
        "title": "Basic end-user support",
        "description": "Can help with simple user and device issues without claiming advanced administration capability.",
        "mustHave": [
          "Log a clear support request",
          "Identify user, device and fault symptoms",
          "Follow a checklist or escalation process",
          "Communicate politely with end users"
        ],
        "niceToHave": [
          "Basic remote-support session experience",
          "Basic device rebuild or setup exposure",
          "Basic Microsoft 365 admin exposure"
        ]
      },
      {
        "title": "Basic product awareness",
        "description": "Has seen or assisted with common IT systems and business-user platforms.",
        "mustHave": [
          "Windows devices",
          "Monitors and docks",
          "Printers or scanners",
          "Wi-Fi and Ethernet connections"
        ],
        "niceToHave": [
          "Microsoft 365",
          "Google Workspace",
          "Intune or device management",
          "Basic firewall/router awareness"
        ]
      }
    ],
    "typicalEvidence": [
      "Support tickets assisted on",
      "Supervisor or senior technician reference",
      "Examples of device setup/checklist work",
      "Basic platform exposure list"
    ],
    "productKnowledgeTags": [
      "windows-11",
      "macos",
      "microsoft-365",
      "teams",
      "google-workspace",
      "intune",
      "hp",
      "dell",
      "lenovo"
    ],
    "skillGroups": [
      {
        "title": "Must-have: basic IT support knowledge",
        "description": "Minimum practical knowledge needed to claim basic IT support experience.",
        "skills": [
          {
            "name": "Identify common ports, cables, docks, monitors, keyboards, mice and peripherals",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Understand basic desktop/laptop setup flow",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Understand user accounts, passwords and MFA at a basic level",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Record support notes clearly in a ticket or handover",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Follow a troubleshooting checklist",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Escalate issues with useful information",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Work safely with end users and business equipment",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Basic Microsoft 365 awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic Wi-Fi and Ethernet awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic printer/scanner support awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic Windows 10/11 setup awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic macOS awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic remote support awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "it-service-desk-technician",
    "title": "IT Service Desk / Helpdesk Technician",
    "planLevel": "paid-specialist",
    "category": "support",
    "summary": "First-line or second-line service desk role for ticket triage, user support, account issues, Microsoft 365 support, device troubleshooting, escalation and service communication.",
    "suitableFor": [
      "Managed service desks",
      "Internal IT helpdesks",
      "Remote support teams",
      "SMB IT support",
      "Education or corporate estates"
    ],
    "mustHaveSummary": [
      "Can triage and prioritise tickets",
      "Can resolve common user, device and Microsoft 365 issues",
      "Can escalate with clear notes and impact description",
      "Can communicate professionally with users"
    ],
    "niceToHaveSummary": [
      "ITIL awareness",
      "RMM/PSA experience",
      "PowerShell basics",
      "Microsoft 365 admin experience",
      "SLA and queue management experience"
    ],
    "expectedKnowledge": [
      "Ticket lifecycle",
      "Incident versus service request",
      "Password/MFA/account support",
      "Remote support etiquette",
      "Microsoft 365 and Windows support basics",
      "Escalation and documentation"
    ],
    "roleAspects": [
      {
        "title": "Ticket handling",
        "description": "Works effectively in a structured support queue.",
        "mustHave": [
          "Ticket triage",
          "Priority and impact capture",
          "Clear troubleshooting notes",
          "Escalation and handover"
        ],
        "niceToHave": [
          "SLA management",
          "Knowledge-base contribution",
          "Problem trend identification"
        ]
      },
      {
        "title": "User support",
        "description": "Resolves common user-impacting issues.",
        "mustHave": [
          "Account access issues",
          "Microsoft 365 user support",
          "Windows desktop support",
          "Printer and peripheral support"
        ],
        "niceToHave": [
          "macOS support",
          "Mobile device support",
          "Basic network triage"
        ]
      }
    ],
    "typicalEvidence": [
      "Service desk ticket examples",
      "Reference from helpdesk lead",
      "SLA or queue experience",
      "Knowledge-base article examples"
    ],
    "productKnowledgeTags": [
      "microsoft-365",
      "entra-id",
      "exchange-online",
      "teams",
      "sharepoint",
      "windows-11",
      "intune",
      "connectwise",
      "autotask",
      "servicenow",
      "jira-service-management"
    ],
    "skillGroups": [
      {
        "title": "Must-have: ticket and user support",
        "description": "Core helpdesk capability.",
        "skills": [
          {
            "name": "Ticket triage and prioritisation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "User communication and expectation setting",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Password and MFA support process",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Microsoft 365 user issue support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Windows desktop troubleshooting",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Printer and peripheral issue triage",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Escalation with clear evidence",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "ITIL foundation awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Knowledge-base article creation",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic PowerShell support commands",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "RMM/PSA platform experience",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic security incident recognition",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "desktop-euc-technician",
    "title": "Desktop Support / EUC Technician",
    "planLevel": "paid-specialist",
    "category": "support",
    "summary": "End-user computing role for laptop/desktop deployment, operating system support, device refresh, application support, peripherals, profiles, patching and endpoint management.",
    "suitableFor": [
      "Desktop support",
      "Device refresh projects",
      "Office moves",
      "Education estates",
      "Corporate floor support",
      "Executive support"
    ],
    "mustHaveSummary": [
      "Can build, deploy and troubleshoot laptops/desktops",
      "Understands user profiles, apps, drivers and updates",
      "Can support docks, monitors, printers and peripherals"
    ],
    "niceToHaveSummary": [
      "Intune, Autopilot or SCCM experience",
      "MDM awareness",
      "Executive/VIP support",
      "Basic scripting"
    ],
    "expectedKnowledge": [
      "Windows profiles",
      "Device join/enrolment",
      "Application install/support",
      "Drivers and updates",
      "Peripheral and dock support",
      "Data migration basics"
    ],
    "roleAspects": [
      {
        "title": "Device lifecycle",
        "description": "Supports devices from staging through handover and refresh.",
        "mustHave": [
          "Device setup",
          "Application installation",
          "Driver/update validation",
          "User handover"
        ],
        "niceToHave": [
          "Autopilot deployment",
          "SCCM task sequences",
          "Asset lifecycle process"
        ]
      },
      {
        "title": "End-user environment",
        "description": "Supports the practical user workspace.",
        "mustHave": [
          "Dock and monitor support",
          "Printer mapping",
          "Profile/data migration support",
          "Peripheral support"
        ],
        "niceToHave": [
          "macOS support",
          "MDM compliance remediation",
          "VIP support"
        ]
      }
    ],
    "typicalEvidence": [
      "Device deployment project examples",
      "Build checklists",
      "Floor-walking/support references",
      "Asset refresh records"
    ],
    "productKnowledgeTags": [
      "windows-11",
      "intune",
      "autopilot",
      "sccm",
      "microsoft-365",
      "dell",
      "hp",
      "lenovo",
      "macos",
      "jamf"
    ],
    "skillGroups": [
      {
        "title": "Must-have: desktop/EUC support",
        "description": "Core endpoint support capability.",
        "skills": [
          {
            "name": "Windows laptop and desktop setup",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Application installation and support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Driver, update and peripheral troubleshooting",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "User profile and data migration support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Docking station and display support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Printer/scanner support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Device handover and user guidance",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Intune enrolment and compliance support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Windows Autopilot awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "SCCM/MECM deployment awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "macOS support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic PowerShell troubleshooting",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Executive/VIP support",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "it-field-service-engineer",
    "title": "IT Field Service Engineer",
    "planLevel": "paid-specialist",
    "category": "field-service",
    "summary": "On-site IT support role for installing, replacing, troubleshooting and documenting end-user devices, network-adjacent equipment, retail/branch IT and local infrastructure.",
    "suitableFor": [
      "Branch support",
      "Retail IT",
      "Education estates",
      "SMB site visits",
      "Hardware replacement",
      "Office moves"
    ],
    "mustHaveSummary": [
      "Can attend site and resolve practical IT faults",
      "Can replace or install desktop, peripheral and basic network-adjacent equipment",
      "Can document visit outcomes clearly"
    ],
    "niceToHaveSummary": [
      "Retail/POS experience",
      "Basic network checks",
      "Wi-Fi/AP swap support",
      "Warranty repair process experience"
    ],
    "expectedKnowledge": [
      "Site attendance process",
      "Fault confirmation",
      "Swap-out process",
      "End-user communication",
      "Basic network connectivity",
      "Visit reporting"
    ],
    "roleAspects": [
      {
        "title": "On-site fault response",
        "description": "Can work independently on customer premises.",
        "mustHave": [
          "Confirm fault symptoms",
          "Perform agreed fix or swap-out",
          "Validate service restoration",
          "Document outcome"
        ],
        "niceToHave": [
          "Root cause notes",
          "Warranty/RMA process",
          "Remote escalation while on site"
        ]
      },
      {
        "title": "Branch and peripheral support",
        "description": "Supports practical site IT equipment.",
        "mustHave": [
          "PC/laptop replacement",
          "Printer/peripheral support",
          "Network patching instruction follow-through"
        ],
        "niceToHave": [
          "POS/EPOS support",
          "Wi-Fi AP swap support",
          "Comms cabinet tidy-up support"
        ]
      }
    ],
    "typicalEvidence": [
      "Field service reports",
      "Site visit records",
      "Customer references",
      "Branch rollout examples"
    ],
    "productKnowledgeTags": [
      "windows-11",
      "dell",
      "hp",
      "lenovo",
      "unifi",
      "meraki",
      "cisco",
      "epson-printers",
      "zebra",
      "square",
      "epos-now"
    ],
    "skillGroups": [
      {
        "title": "Must-have: site visit delivery",
        "description": "Core field-service skills.",
        "skills": [
          {
            "name": "Attend site and confirm issue scope",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Replace or install laptops, desktops and peripherals",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Patch devices according to instructions",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Validate user or site service restoration",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Document visit notes and photos where required",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Escalate blocked work clearly",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Communicate professionally with site contacts",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "POS/EPOS support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic AP replacement support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic switch/router visual checks",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Warranty/RMA workflow experience",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Multi-site rollout experience",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "it-network-cabling-infrastructure-technician",
    "title": "IT Network Cabling / Infrastructure Technician",
    "planLevel": "paid-specialist",
    "category": "infrastructure",
    "summary": "Structured cabling and IT infrastructure role for data cabling support, patching, comms room tidying, port mapping, labelling and preparing network infrastructure for activation.",
    "suitableFor": [
      "Office fit-outs",
      "Comms room works",
      "Data cabling projects",
      "Education estates",
      "Retail rollouts",
      "Network refresh preparation"
    ],
    "mustHaveSummary": [
      "Understands structured cabling and patching instructions",
      "Can label and document network outlets and patching",
      "Can work around live network infrastructure carefully"
    ],
    "niceToHaveSummary": [
      "Fibre handling awareness",
      "Port mapping",
      "Switch migration support",
      "Wi-Fi AP cabling readiness"
    ],
    "expectedKnowledge": [
      "Structured cabling concepts",
      "Patch panels and outlets",
      "Cabinet layout",
      "Cable labelling",
      "Copper versus fibre basics",
      "Network activation handover"
    ],
    "roleAspects": [
      {
        "title": "Infrastructure support",
        "description": "Supports physical network readiness without claiming senior network design capability.",
        "mustHave": [
          "Patch panel/outlet awareness",
          "Cable labelling",
          "Port mapping support",
          "Cabinet tidiness"
        ],
        "niceToHave": [
          "Fibre patching awareness",
          "Switch migration patching",
          "Wireless AP cabling readiness"
        ]
      },
      {
        "title": "Documentation",
        "description": "Creates useful handover information for network teams.",
        "mustHave": [
          "Label records",
          "Port notes",
          "Patch list updates"
        ],
        "niceToHave": [
          "Marked-up floor plans",
          "Before/after cabinet photos",
          "Change window notes"
        ]
      }
    ],
    "typicalEvidence": [
      "Cable schedule examples",
      "Comms cabinet photos",
      "Patch list examples",
      "Site supervisor references"
    ],
    "productKnowledgeTags": [
      "ethernet",
      "structured-cabling",
      "fibre-basics",
      "cisco",
      "meraki",
      "aruba",
      "unifi"
    ],
    "skillGroups": [
      {
        "title": "Must-have: network infrastructure support",
        "description": "Core cabling/infrastructure capability.",
        "skills": [
          {
            "name": "Understand patch panel, outlet and switch port relationships",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Follow patching instructions accurately",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Label ports and cables clearly",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Support port mapping and records",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Work carefully in live comms cabinets",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Recognise copper versus fibre connections",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Report damaged or undocumented cabling",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Fibre patching awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Switch migration patching support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Wireless AP cable readiness checks",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Cabinet tidy and dressing support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Marked-up drawing support",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "network-support-engineer",
    "title": "Network Support Engineer",
    "planLevel": "paid-specialist",
    "category": "networking",
    "summary": "Network support role for LAN/WAN connectivity, switches, routers, VLANs, DHCP/DNS awareness, basic firewall coordination, fault triage and change support.",
    "suitableFor": [
      "SMB networks",
      "Corporate LAN support",
      "Education networks",
      "Branch connectivity",
      "Network refresh projects",
      "Managed network support"
    ],
    "mustHaveSummary": [
      "Understands LAN/WAN fundamentals",
      "Can troubleshoot connectivity issues",
      "Can support switch/router changes under process control"
    ],
    "niceToHaveSummary": [
      "Cisco, Meraki, Aruba, UniFi or Fortinet experience",
      "VLAN and routing awareness",
      "Firewall policy awareness",
      "Network monitoring experience"
    ],
    "expectedKnowledge": [
      "IP addressing",
      "Subnet basics",
      "VLANs",
      "DHCP/DNS",
      "Switch ports",
      "Routing basics",
      "Firewall and WAN concepts"
    ],
    "roleAspects": [
      {
        "title": "Network troubleshooting",
        "description": "Can diagnose practical network issues.",
        "mustHave": [
          "Layer 1/2/3 triage",
          "IP configuration checks",
          "DHCP/DNS awareness",
          "Switch port status interpretation"
        ],
        "niceToHave": [
          "Packet capture awareness",
          "Routing table checks",
          "Monitoring platform use"
        ]
      },
      {
        "title": "Network change support",
        "description": "Can support controlled changes.",
        "mustHave": [
          "Document change scope",
          "Validate before/after connectivity",
          "Escalate unexpected behaviour"
        ],
        "niceToHave": [
          "VLAN changes",
          "Firewall rule request support",
          "Switch migration support"
        ]
      }
    ],
    "typicalEvidence": [
      "Network support tickets",
      "Change notes",
      "Monitoring examples",
      "Vendor/platform exposure"
    ],
    "productKnowledgeTags": [
      "cisco",
      "meraki",
      "aruba",
      "unifi",
      "fortinet",
      "sophos",
      "palo-alto",
      "sonicwall",
      "tcp-ip",
      "vlans",
      "dhcp-dns"
    ],
    "skillGroups": [
      {
        "title": "Must-have: network support fundamentals",
        "description": "Core network support skills.",
        "skills": [
          {
            "name": "IP addressing and subnet awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "DHCP and DNS troubleshooting awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Switch port and link-status checks",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "VLAN awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "LAN versus WAN fault triage",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Basic router/firewall role awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Clear network fault documentation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Cisco switch support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Meraki dashboard support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Aruba switch/AP support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "UniFi Network support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Firewall policy request support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Packet capture awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Network monitoring platform awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "wireless-wifi-engineer",
    "title": "Wireless / Wi-Fi Engineer",
    "planLevel": "paid-specialist",
    "category": "wireless",
    "summary": "Wireless networking role for access point deployment, SSID configuration, roaming validation, coverage troubleshooting, guest networks and wireless performance support.",
    "suitableFor": [
      "Office Wi-Fi",
      "Education Wi-Fi",
      "Hospitality Wi-Fi",
      "Retail Wi-Fi",
      "Warehouse Wi-Fi",
      "Guest networks"
    ],
    "mustHaveSummary": [
      "Understands AP, SSID, client and controller/cloud roles",
      "Can deploy and validate Wi-Fi coverage",
      "Can troubleshoot common client and roaming issues"
    ],
    "niceToHaveSummary": [
      "Survey interpretation",
      "Channel and power planning awareness",
      "Meraki/Aruba/UniFi experience",
      "Guest/captive portal experience"
    ],
    "expectedKnowledge": [
      "SSID",
      "WPA2/WPA3",
      "2.4/5/6 GHz basics",
      "Roaming",
      "Channel interference",
      "AP placement",
      "Guest network separation"
    ],
    "roleAspects": [
      {
        "title": "Wi-Fi deployment",
        "description": "Can support practical Wi-Fi rollout work.",
        "mustHave": [
          "AP adoption or registration support",
          "SSID validation",
          "Client connection testing",
          "Coverage spot checks"
        ],
        "niceToHave": [
          "Survey interpretation",
          "Channel/power tuning",
          "Guest portal setup"
        ]
      },
      {
        "title": "Wi-Fi troubleshooting",
        "description": "Can diagnose common wireless issues.",
        "mustHave": [
          "Client connectivity triage",
          "Signal and coverage observations",
          "Roaming issue capture"
        ],
        "niceToHave": [
          "RF interference awareness",
          "Band steering awareness",
          "802.1X awareness"
        ]
      }
    ],
    "typicalEvidence": [
      "Wi-Fi rollout examples",
      "Controller/cloud dashboard experience",
      "Coverage validation notes",
      "Support tickets"
    ],
    "productKnowledgeTags": [
      "meraki",
      "aruba",
      "unifi",
      "ruckus",
      "cisco",
      "wifi-6-6e-7",
      "radius-8021x"
    ],
    "skillGroups": [
      {
        "title": "Must-have: Wi-Fi support",
        "description": "Core wireless skills.",
        "skills": [
          {
            "name": "Understand AP, SSID and wireless client roles",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Validate SSID broadcast and client connection",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Understand basic 2.4 GHz, 5 GHz and 6 GHz differences",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Recognise coverage and roaming symptoms",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Support AP adoption/registration process",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Document Wi-Fi faults clearly",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Meraki wireless support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Aruba wireless support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "UniFi wireless support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Ruckus wireless awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "802.1X/RADIUS awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Guest/captive portal awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "RF survey interpretation",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "windows-systems-administrator",
    "title": "Windows Server / Systems Administrator",
    "planLevel": "paid-specialist",
    "category": "systems",
    "summary": "Systems administration role for Windows Server, Active Directory, Group Policy, file/print services, patching, backup coordination and operational server support.",
    "suitableFor": [
      "Internal IT",
      "Managed services",
      "Education estates",
      "SMB server support",
      "Server refresh projects",
      "Hybrid environments"
    ],
    "mustHaveSummary": [
      "Can administer Windows Server and Active Directory",
      "Understands Group Policy, file services and permissions",
      "Can support patching, backup checks and server incidents"
    ],
    "niceToHaveSummary": [
      "Hybrid AD/Entra awareness",
      "PowerShell scripting",
      "Virtualisation experience",
      "Monitoring and backup platform experience"
    ],
    "expectedKnowledge": [
      "Active Directory",
      "DNS/DHCP",
      "Group Policy",
      "NTFS/share permissions",
      "Windows Server roles",
      "Patching",
      "Backups",
      "Event logs"
    ],
    "roleAspects": [
      {
        "title": "Core server administration",
        "description": "Maintains common Windows Server services.",
        "mustHave": [
          "AD user/group support",
          "Group Policy support",
          "File permissions",
          "DNS/DHCP awareness"
        ],
        "niceToHave": [
          "Certificate services awareness",
          "Print server management",
          "RDS awareness"
        ]
      },
      {
        "title": "Operational support",
        "description": "Keeps servers healthy and supportable.",
        "mustHave": [
          "Patch coordination",
          "Event log checks",
          "Backup status checks",
          "Service restart/change process"
        ],
        "niceToHave": [
          "PowerShell automation",
          "Monitoring alert response",
          "Server migration support"
        ]
      }
    ],
    "typicalEvidence": [
      "Server support records",
      "Change notes",
      "PowerShell examples",
      "Backup/patch evidence"
    ],
    "productKnowledgeTags": [
      "windows-server",
      "active-directory",
      "group-policy",
      "powershell",
      "hyper-v",
      "vmware",
      "veeam",
      "microsoft-365",
      "entra-id"
    ],
    "skillGroups": [
      {
        "title": "Must-have: Windows systems administration",
        "description": "Core systems admin skills.",
        "skills": [
          {
            "name": "Active Directory users, groups and OUs",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Group Policy support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "File share and NTFS permission support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "DNS and DHCP awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Windows Server patching support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Event log troubleshooting",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Backup status validation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "PowerShell scripting",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Certificate services awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "RDS support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Server migration support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Hybrid AD/Entra awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Monitoring platform response",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "microsoft-365-modern-workplace-admin",
    "title": "Microsoft 365 / Modern Workplace Administrator",
    "planLevel": "paid-specialist",
    "category": "cloud",
    "summary": "Microsoft 365 administration role for Exchange Online, Teams, SharePoint, OneDrive, licensing, security defaults, users, groups and collaboration support.",
    "suitableFor": [
      "Microsoft 365 tenants",
      "SMB cloud support",
      "Internal IT",
      "Managed services",
      "Modern workplace projects",
      "Tenant clean-up"
    ],
    "mustHaveSummary": [
      "Can administer Microsoft 365 users, groups and licensing",
      "Can support Exchange Online, Teams, SharePoint and OneDrive",
      "Understands MFA and basic tenant security"
    ],
    "niceToHaveSummary": [
      "Conditional Access awareness",
      "Intune integration",
      "Purview/security awareness",
      "PowerShell for Microsoft 365"
    ],
    "expectedKnowledge": [
      "Microsoft 365 admin centre",
      "Exchange Online",
      "Teams admin",
      "SharePoint/OneDrive",
      "Licensing",
      "MFA",
      "Groups",
      "Mail flow"
    ],
    "roleAspects": [
      {
        "title": "Tenant administration",
        "description": "Supports day-to-day Microsoft 365 admin tasks.",
        "mustHave": [
          "User and licence administration",
          "Group and mailbox support",
          "Teams and SharePoint support",
          "OneDrive user support"
        ],
        "niceToHave": [
          "PowerShell admin",
          "Tenant clean-up",
          "Cross-tenant migration awareness"
        ]
      },
      {
        "title": "Security and governance awareness",
        "description": "Understands common M365 controls.",
        "mustHave": [
          "MFA awareness",
          "Security defaults awareness",
          "Mailbox access controls"
        ],
        "niceToHave": [
          "Conditional Access",
          "DLP/Purview awareness",
          "Defender for 365 awareness"
        ]
      }
    ],
    "typicalEvidence": [
      "Tenant admin examples",
      "Migration support examples",
      "Admin change notes",
      "Support ticket history"
    ],
    "productKnowledgeTags": [
      "microsoft-365",
      "exchange-online",
      "teams",
      "sharepoint",
      "onedrive",
      "entra-id",
      "intune",
      "defender-365",
      "purview",
      "powershell"
    ],
    "skillGroups": [
      {
        "title": "Must-have: Microsoft 365 administration",
        "description": "Core modern workplace skills.",
        "skills": [
          {
            "name": "User, group and licence administration",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Exchange Online mailbox support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Teams user and policy support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "SharePoint and OneDrive support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "MFA and basic security setting awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Mail flow issue triage",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Clear tenant change documentation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Conditional Access awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "PowerShell for Microsoft 365",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Defender for 365 awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Purview/DLP awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Tenant-to-tenant migration support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "SharePoint permissions design awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "azure-entra-cloud-administrator",
    "title": "Azure / Entra ID Cloud Administrator",
    "planLevel": "paid-specialist",
    "category": "cloud",
    "summary": "Cloud administration role for Azure resources, Entra ID, identity, access management, hybrid identity, virtual networks and operational cloud support.",
    "suitableFor": [
      "Azure tenants",
      "Hybrid identity projects",
      "Cloud operations",
      "SMB cloud environments",
      "Managed services",
      "Cloud migration support"
    ],
    "mustHaveSummary": [
      "Understands Entra ID users, groups and roles",
      "Can support Azure resources and access control",
      "Can follow cloud change and documentation processes"
    ],
    "niceToHaveSummary": [
      "Conditional Access",
      "Azure networking",
      "Azure Virtual Machines",
      "Hybrid identity",
      "Cost/security governance"
    ],
    "expectedKnowledge": [
      "Entra ID",
      "RBAC",
      "Subscriptions/resource groups",
      "Azure networking basics",
      "Conditional Access",
      "Hybrid identity",
      "Cloud monitoring"
    ],
    "roleAspects": [
      {
        "title": "Identity and access",
        "description": "Supports cloud identity and access control.",
        "mustHave": [
          "Users and groups",
          "Role assignment awareness",
          "MFA/Conditional Access awareness",
          "Join/enrolment concepts"
        ],
        "niceToHave": [
          "Hybrid identity",
          "Privileged Identity Management awareness",
          "SSO/SAML/OIDC awareness"
        ]
      },
      {
        "title": "Azure operations",
        "description": "Supports operational Azure environments.",
        "mustHave": [
          "Resource group awareness",
          "VM support awareness",
          "Storage/networking basics",
          "Monitoring and alert response"
        ],
        "niceToHave": [
          "Cost management",
          "Backup configuration awareness",
          "IaC awareness"
        ]
      }
    ],
    "typicalEvidence": [
      "Azure admin examples",
      "Entra ID change records",
      "Cloud support tickets",
      "Certification evidence"
    ],
    "productKnowledgeTags": [
      "azure",
      "entra-id",
      "conditional-access",
      "azure-vm",
      "azure-networking",
      "azure-backup",
      "powershell",
      "terraform"
    ],
    "skillGroups": [
      {
        "title": "Must-have: Azure and Entra administration",
        "description": "Core cloud admin skills.",
        "skills": [
          {
            "name": "Entra ID user and group administration",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Role and access control awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "MFA and Conditional Access awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Azure subscription and resource group awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Azure VM support awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Azure networking basics",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Cloud change documentation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Hybrid identity support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "SSO/SAML/OIDC awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Azure Backup awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Cost management awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "PowerShell/Azure CLI",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Terraform/IaC awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "cybersecurity-support-analyst",
    "title": "Cybersecurity Support Technician / SOC Analyst",
    "planLevel": "paid-specialist",
    "category": "security",
    "summary": "Security support role for alert triage, endpoint protection, identity security, phishing review, incident notes, escalation and security hygiene tasks.",
    "suitableFor": [
      "SOC Level 1",
      "Managed security services",
      "Internal security support",
      "SMB security monitoring",
      "Microsoft security operations"
    ],
    "mustHaveSummary": [
      "Can triage alerts and record evidence",
      "Understands phishing, MFA, endpoint protection and suspicious activity",
      "Can escalate incidents clearly"
    ],
    "niceToHaveSummary": [
      "SIEM experience",
      "Microsoft Defender/Sentinel awareness",
      "Basic vulnerability management",
      "User awareness support"
    ],
    "expectedKnowledge": [
      "Phishing",
      "Malware",
      "MFA",
      "Endpoint protection",
      "Alert triage",
      "Incident notes",
      "Escalation",
      "Security hygiene"
    ],
    "roleAspects": [
      {
        "title": "Alert triage",
        "description": "Handles basic security alerts responsibly.",
        "mustHave": [
          "Review alert details",
          "Capture user/device/context",
          "Follow escalation runbooks",
          "Record evidence"
        ],
        "niceToHave": [
          "SIEM query awareness",
          "Threat intelligence lookup",
          "False-positive analysis"
        ]
      },
      {
        "title": "User and endpoint security",
        "description": "Supports common security controls.",
        "mustHave": [
          "Phishing report handling",
          "MFA issue awareness",
          "Endpoint protection status checks"
        ],
        "niceToHave": [
          "Vulnerability remediation tracking",
          "Defender/Sentinel awareness",
          "Security awareness support"
        ]
      }
    ],
    "typicalEvidence": [
      "Security ticket examples",
      "Alert triage notes",
      "Runbook examples",
      "Security platform exposure"
    ],
    "productKnowledgeTags": [
      "defender-endpoint",
      "defender-365",
      "sentinel",
      "crowdstrike",
      "sophos",
      "mimecast",
      "duo",
      "okta",
      "entra-id",
      "conditional-access"
    ],
    "skillGroups": [
      {
        "title": "Must-have: security support",
        "description": "Core cyber support skills.",
        "skills": [
          {
            "name": "Phishing report triage",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Endpoint protection alert review",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "MFA and suspicious sign-in awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Incident note capture",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Escalation using runbooks",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Basic malware and compromise indicators",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "User communication during security events",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Microsoft Defender experience",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Microsoft Sentinel awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "SIEM search awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Vulnerability remediation tracking",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Security awareness training support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Email security platform awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "firewall-network-security-engineer",
    "title": "Firewall / Network Security Engineer",
    "planLevel": "paid-specialist",
    "category": "security",
    "summary": "Security/network role for firewall policy support, VPNs, segmentation, remote access, security gateway troubleshooting and controlled change implementation.",
    "suitableFor": [
      "Firewall support",
      "Branch networks",
      "Managed security",
      "Remote access support",
      "Network security projects"
    ],
    "mustHaveSummary": [
      "Understands firewall, VPN and segmentation basics",
      "Can support policy changes through change control",
      "Can troubleshoot connectivity across security boundaries"
    ],
    "niceToHaveSummary": [
      "Fortinet, Sophos, Palo Alto, SonicWall or Cisco experience",
      "SSL/IPsec VPN",
      "NAT and rulebase analysis",
      "Logging and diagnostics"
    ],
    "expectedKnowledge": [
      "Firewall rules",
      "NAT",
      "VPN",
      "Routing basics",
      "Segmentation",
      "Logging",
      "Change control",
      "Security impact"
    ],
    "roleAspects": [
      {
        "title": "Firewall operations",
        "description": "Supports firewall and secure connectivity.",
        "mustHave": [
          "Rule purpose review",
          "NAT awareness",
          "VPN user/site support",
          "Log review"
        ],
        "niceToHave": [
          "HA pair awareness",
          "SSL inspection awareness",
          "SD-WAN awareness"
        ]
      },
      {
        "title": "Change and troubleshooting",
        "description": "Makes or supports controlled security changes.",
        "mustHave": [
          "Document requested change",
          "Validate allowed/blocked traffic",
          "Rollback awareness"
        ],
        "niceToHave": [
          "Packet capture",
          "Policy optimisation",
          "Segmentation design awareness"
        ]
      }
    ],
    "typicalEvidence": [
      "Firewall change records",
      "VPN support tickets",
      "Platform exposure",
      "Security gateway troubleshooting examples"
    ],
    "productKnowledgeTags": [
      "fortinet",
      "sophos",
      "palo-alto",
      "sonicwall",
      "cisco",
      "meraki",
      "vpn",
      "vlans"
    ],
    "skillGroups": [
      {
        "title": "Must-have: firewall support",
        "description": "Core firewall/network security skills.",
        "skills": [
          {
            "name": "Firewall policy awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "NAT awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "VPN support awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Security log review",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Routing and VLAN interaction awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Change control and rollback awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Connectivity testing across firewall boundaries",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Fortinet support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Sophos firewall support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Palo Alto support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "SonicWall support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "SSL/IPsec VPN configuration",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Packet capture analysis",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "SD-WAN awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "backup-disaster-recovery-technician",
    "title": "Backup / Disaster Recovery Technician",
    "planLevel": "paid-specialist",
    "category": "systems",
    "summary": "Backup and recovery role for monitoring backup status, investigating failures, validating restores, documenting recovery steps and supporting DR readiness.",
    "suitableFor": [
      "Managed services",
      "Internal IT",
      "SMB server estates",
      "Cloud backup operations",
      "Compliance-driven environments"
    ],
    "mustHaveSummary": [
      "Can monitor backup jobs and investigate failures",
      "Can perform or support restore tests",
      "Understands RPO/RTO and recovery documentation"
    ],
    "niceToHaveSummary": [
      "Veeam, Datto, Acronis or Azure Backup experience",
      "Immutable backup awareness",
      "DR testing experience"
    ],
    "expectedKnowledge": [
      "Backup jobs",
      "Restore points",
      "RPO/RTO",
      "Retention",
      "Offsite/cloud backup",
      "Restore testing",
      "Failure remediation"
    ],
    "roleAspects": [
      {
        "title": "Backup operations",
        "description": "Keeps backup services visible and supportable.",
        "mustHave": [
          "Daily backup status checks",
          "Failure investigation",
          "Escalation of missed backups",
          "Retention awareness"
        ],
        "niceToHave": [
          "Immutable backup awareness",
          "Cloud backup policy support",
          "Backup capacity monitoring"
        ]
      },
      {
        "title": "Restore and DR readiness",
        "description": "Proves recoverability.",
        "mustHave": [
          "File restore support",
          "VM/server restore awareness",
          "Restore test documentation"
        ],
        "niceToHave": [
          "DR test participation",
          "RPO/RTO planning",
          "Runbook creation"
        ]
      }
    ],
    "typicalEvidence": [
      "Backup reports",
      "Restore test records",
      "DR exercise notes",
      "Platform experience"
    ],
    "productKnowledgeTags": [
      "veeam",
      "datto",
      "acronis",
      "azure-backup",
      "windows-server",
      "vmware",
      "hyper-v"
    ],
    "skillGroups": [
      {
        "title": "Must-have: backup and recovery support",
        "description": "Core backup/DR skills.",
        "skills": [
          {
            "name": "Monitor backup job status",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Investigate failed backups",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Understand retention and restore points",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Support file restore requests",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Document restore test outcomes",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Escalate backup risk clearly",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Understand RPO and RTO basics",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Veeam administration",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Datto backup support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Acronis backup support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Azure Backup awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Immutable backup awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "DR runbook support",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "virtualisation-server-engineer",
    "title": "Virtualisation / Server Engineer",
    "planLevel": "paid-specialist",
    "category": "systems",
    "summary": "Server infrastructure role for VMware, Hyper-V, virtual machines, host health, storage/network awareness, migration support and operational troubleshooting.",
    "suitableFor": [
      "Server estates",
      "VM migrations",
      "Private cloud",
      "Education/corporate infrastructure",
      "Managed services"
    ],
    "mustHaveSummary": [
      "Understands virtual machines, hosts, storage and networking",
      "Can support VM operations and troubleshooting",
      "Can document server infrastructure changes"
    ],
    "niceToHaveSummary": [
      "VMware or Hyper-V administration",
      "Storage/SAN awareness",
      "High availability awareness",
      "Backup integration awareness"
    ],
    "expectedKnowledge": [
      "VMs",
      "Hosts",
      "Clusters",
      "Datastores",
      "vSwitches",
      "Snapshots",
      "Resource allocation",
      "HA basics"
    ],
    "roleAspects": [
      {
        "title": "Virtual infrastructure support",
        "description": "Supports common virtualisation operations.",
        "mustHave": [
          "VM status checks",
          "Resource allocation awareness",
          "Snapshot risk awareness",
          "Host health checks"
        ],
        "niceToHave": [
          "Cluster/HA awareness",
          "Storage multipath awareness",
          "Migration/vMotion awareness"
        ]
      },
      {
        "title": "Server operations",
        "description": "Supports server workloads running on virtual infrastructure.",
        "mustHave": [
          "VM power/state management",
          "Guest OS support coordination",
          "Backup integration awareness"
        ],
        "niceToHave": [
          "Template deployment",
          "Capacity planning",
          "Hypervisor patching support"
        ]
      }
    ],
    "typicalEvidence": [
      "VMware/Hyper-V support records",
      "Migration notes",
      "Infrastructure diagrams",
      "Change tickets"
    ],
    "productKnowledgeTags": [
      "vmware",
      "hyper-v",
      "windows-server",
      "veeam",
      "datto",
      "azure-vm"
    ],
    "skillGroups": [
      {
        "title": "Must-have: virtualisation support",
        "description": "Core virtual server skills.",
        "skills": [
          {
            "name": "Understand host, VM, datastore and virtual network roles",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "VM status and resource checks",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Snapshot awareness and risk",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Basic VMware or Hyper-V administration",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Coordinate guest OS and backup support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Document VM changes",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Escalate infrastructure risk clearly",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "vMotion/live migration awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Cluster/HA awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Storage/SAN awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Template deployment",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Hypervisor patching support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Capacity planning awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "linux-support-engineer",
    "title": "Linux Support Engineer",
    "planLevel": "paid-specialist",
    "category": "systems",
    "summary": "Linux operations role for server access, package/service management, logs, permissions, networking basics, scripting and application support escalation.",
    "suitableFor": [
      "Web servers",
      "Application servers",
      "Dev/test environments",
      "Cloud Linux instances",
      "Managed hosting",
      "Internal Linux services"
    ],
    "mustHaveSummary": [
      "Can access and support Linux systems safely",
      "Can review logs, services, permissions and basic network state",
      "Can document commands and changes"
    ],
    "niceToHaveSummary": [
      "Bash scripting",
      "Systemd",
      "Package managers",
      "Cloud Linux",
      "Container awareness"
    ],
    "expectedKnowledge": [
      "Shell basics",
      "Users and permissions",
      "Services",
      "Logs",
      "Packages",
      "SSH",
      "Networking basics",
      "Filesystem layout"
    ],
    "roleAspects": [
      {
        "title": "Linux operations",
        "description": "Supports common Linux admin tasks.",
        "mustHave": [
          "SSH access process",
          "Service status checks",
          "Log review",
          "Filesystem and permission awareness"
        ],
        "niceToHave": [
          "Bash scripting",
          "Cron/systemd timers",
          "Package repository awareness"
        ]
      },
      {
        "title": "Troubleshooting",
        "description": "Investigates Linux issues safely.",
        "mustHave": [
          "Disk space checks",
          "Process/service checks",
          "Network connectivity checks"
        ],
        "niceToHave": [
          "Container/log aggregation awareness",
          "Cloud instance support",
          "Performance triage"
        ]
      }
    ],
    "typicalEvidence": [
      "Linux support tickets",
      "Command examples",
      "Change notes",
      "Server support records"
    ],
    "productKnowledgeTags": [
      "linux",
      "ubuntu",
      "red-hat",
      "debian",
      "bash",
      "docker",
      "aws",
      "azure"
    ],
    "skillGroups": [
      {
        "title": "Must-have: Linux support",
        "description": "Core Linux admin/support skills.",
        "skills": [
          {
            "name": "SSH and secure access process",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Service status and restart awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Log file review",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "User and permission awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Disk space and filesystem checks",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Basic Linux network checks",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Document commands and changes",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Bash scripting",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Systemd unit awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Package manager support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Container awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Cloud Linux instance support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Performance triage",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "mac-apple-device-support-technician",
    "title": "Mac / Apple Device Support Technician",
    "planLevel": "paid-specialist",
    "category": "support",
    "summary": "Apple device support role for macOS, iOS/iPadOS, Apple Business Manager, Jamf or MDM enrolment, user support and compliance troubleshooting.",
    "suitableFor": [
      "Creative teams",
      "Education estates",
      "Executive support",
      "Mac fleets",
      "iPad deployments",
      "BYOD environments"
    ],
    "mustHaveSummary": [
      "Can support macOS and Apple device users",
      "Understands Apple ID/managed Apple ID and enrolment concepts",
      "Can support basic MDM compliance and app deployment"
    ],
    "niceToHaveSummary": [
      "Jamf or Intune for Apple experience",
      "Apple Business Manager awareness",
      "macOS troubleshooting",
      "iOS/iPadOS fleet support"
    ],
    "expectedKnowledge": [
      "macOS settings",
      "Apple silicon basics",
      "MDM enrolment",
      "Managed Apple IDs",
      "Profiles",
      "Apps",
      "FileVault",
      "Updates"
    ],
    "roleAspects": [
      {
        "title": "Apple user support",
        "description": "Supports Apple endpoints in business environments.",
        "mustHave": [
          "macOS user troubleshooting",
          "iOS/iPadOS support awareness",
          "App and update support",
          "Peripheral/display support"
        ],
        "niceToHave": [
          "FileVault support",
          "Migration Assistant awareness",
          "Executive support"
        ]
      },
      {
        "title": "Apple fleet management",
        "description": "Supports managed Apple devices.",
        "mustHave": [
          "MDM enrolment awareness",
          "Configuration profile awareness",
          "Managed app deployment awareness"
        ],
        "niceToHave": [
          "Jamf administration",
          "Apple Business Manager",
          "Intune for macOS/iOS"
        ]
      }
    ],
    "typicalEvidence": [
      "Apple support tickets",
      "MDM examples",
      "Device deployment examples",
      "User support references"
    ],
    "productKnowledgeTags": [
      "macos",
      "ios-ipados",
      "jamf",
      "apple-business-manager",
      "intune",
      "microsoft-365",
      "google-workspace"
    ],
    "skillGroups": [
      {
        "title": "Must-have: Apple device support",
        "description": "Core Apple support skills.",
        "skills": [
          {
            "name": "macOS troubleshooting",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "iOS/iPadOS support awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Apple account/enrolment awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Configuration profile awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "App deployment support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Update and compliance support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "User handover and guidance",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Jamf administration",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Apple Business Manager awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Intune for Apple devices",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "FileVault support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "macOS migration support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Executive Mac support",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "mdm-endpoint-management-specialist",
    "title": "MDM / Endpoint Management Specialist",
    "planLevel": "paid-specialist",
    "category": "cloud",
    "summary": "Endpoint management role for Intune, Autopilot, compliance policies, app deployment, configuration profiles, update rings and device lifecycle control.",
    "suitableFor": [
      "Modern workplace projects",
      "Device refresh",
      "Managed services",
      "Compliance-driven estates",
      "Remote-work device fleets"
    ],
    "mustHaveSummary": [
      "Can manage endpoint enrolment, compliance and app deployment",
      "Understands device lifecycle and policy impact",
      "Can troubleshoot managed device issues"
    ],
    "niceToHaveSummary": [
      "Autopilot design",
      "Conditional Access integration",
      "macOS/iOS/Android management",
      "SCCM co-management"
    ],
    "expectedKnowledge": [
      "MDM enrolment",
      "Compliance policies",
      "Configuration profiles",
      "App deployment",
      "Update rings",
      "Autopilot",
      "Device lifecycle"
    ],
    "roleAspects": [
      {
        "title": "Endpoint policy management",
        "description": "Builds and maintains endpoint policy sets.",
        "mustHave": [
          "Device enrolment",
          "Configuration profiles",
          "Compliance policy awareness",
          "App deployment"
        ],
        "niceToHave": [
          "Conditional Access integration",
          "Security baselines",
          "macOS/iOS/Android policies"
        ]
      },
      {
        "title": "Deployment and lifecycle",
        "description": "Supports device build and refresh processes.",
        "mustHave": [
          "Autopilot awareness",
          "Device group targeting",
          "Update policy support"
        ],
        "niceToHave": [
          "Co-management",
          "Remediation scripts",
          "Reporting and compliance dashboards"
        ]
      }
    ],
    "typicalEvidence": [
      "Intune policy examples",
      "Device deployment records",
      "Compliance reports",
      "Autopilot project examples"
    ],
    "productKnowledgeTags": [
      "intune",
      "autopilot",
      "sccm",
      "entra-id",
      "conditional-access",
      "windows-11",
      "macos",
      "ios-ipados",
      "android-enterprise"
    ],
    "skillGroups": [
      {
        "title": "Must-have: endpoint management",
        "description": "Core MDM/endpoint skills.",
        "skills": [
          {
            "name": "Device enrolment support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Configuration profile management",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Compliance policy awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Application deployment support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Windows update policy awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Autopilot process awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Managed device troubleshooting",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Conditional Access integration",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Security baseline deployment",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "macOS/iOS management",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Android Enterprise management",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "SCCM co-management",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "PowerShell remediation scripts",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "voip-unified-communications-engineer",
    "title": "VoIP / Unified Communications Engineer",
    "planLevel": "paid-specialist",
    "category": "specialist",
    "summary": "Voice and UC role for Teams Phone, SIP, hosted PBX, handsets, call routing, numbers, SBC awareness, voicemail and voice quality troubleshooting.",
    "suitableFor": [
      "Business voice",
      "Contact centre support",
      "Teams Phone projects",
      "Hosted PBX",
      "Branch telephony",
      "UC migrations"
    ],
    "mustHaveSummary": [
      "Understands SIP/VoIP call flow",
      "Can support users, handsets and call routing",
      "Can troubleshoot common voice quality and registration issues"
    ],
    "niceToHaveSummary": [
      "Teams Phone",
      "3CX",
      "SBC awareness",
      "Number porting support",
      "QoS awareness"
    ],
    "expectedKnowledge": [
      "SIP",
      "DDI numbers",
      "Call routing",
      "Handsets",
      "Softphones",
      "Voicemail",
      "SBC",
      "QoS",
      "Voice quality"
    ],
    "roleAspects": [
      {
        "title": "Voice support",
        "description": "Supports operational business voice services.",
        "mustHave": [
          "User/extension support",
          "Call routing awareness",
          "Handset/softphone support",
          "Voicemail setup"
        ],
        "niceToHave": [
          "Contact centre awareness",
          "Number porting support",
          "Call recording awareness"
        ]
      },
      {
        "title": "Voice troubleshooting",
        "description": "Diagnoses practical voice issues.",
        "mustHave": [
          "Registration checks",
          "Audio path issue capture",
          "Call quality symptom capture"
        ],
        "niceToHave": [
          "SIP trace awareness",
          "QoS awareness",
          "SBC troubleshooting"
        ]
      }
    ],
    "typicalEvidence": [
      "Voice support tickets",
      "Teams Phone/3CX project examples",
      "Call routing change notes"
    ],
    "productKnowledgeTags": [
      "teams-phone",
      "3cx",
      "ringcentral",
      "mitel",
      "avaya",
      "sip",
      "sbc",
      "yealink",
      "poly"
    ],
    "skillGroups": [
      {
        "title": "Must-have: voice and UC support",
        "description": "Core VoIP/UC skills.",
        "skills": [
          {
            "name": "SIP/VoIP concept awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "User and extension support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Handset and softphone setup support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Call routing and voicemail awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Voice quality issue triage",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Number/DDI awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Clear voice fault documentation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Teams Phone administration",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "3CX administration",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "SBC awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "QoS awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "SIP trace awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Contact centre awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "data-centre-technician",
    "title": "Data Centre Technician",
    "planLevel": "paid-specialist",
    "category": "infrastructure",
    "summary": "Data centre role for rack/stack support, structured patching, remote hands, hardware swaps, asset checks, change windows and controlled operational work.",
    "suitableFor": [
      "Data centres",
      "Comms rooms",
      "Hosting environments",
      "Enterprise infrastructure",
      "Hardware refresh",
      "Remote hands"
    ],
    "mustHaveSummary": [
      "Can follow strict change instructions",
      "Can rack, patch and document infrastructure work",
      "Can perform remote-hands checks accurately"
    ],
    "niceToHaveSummary": [
      "Server hardware swap experience",
      "Fibre patching awareness",
      "Out-of-band management awareness",
      "Asset audit experience"
    ],
    "expectedKnowledge": [
      "Rack positions",
      "Patch records",
      "Asset labels",
      "Remote hands",
      "Change windows",
      "Power feeds awareness",
      "Hardware status"
    ],
    "roleAspects": [
      {
        "title": "Controlled infrastructure work",
        "description": "Works accurately in controlled technical environments.",
        "mustHave": [
          "Follow change instructions",
          "Rack/stack support",
          "Patch according to records",
          "Asset label checks"
        ],
        "niceToHave": [
          "Remote console awareness",
          "Hardware replacement",
          "Fibre patching"
        ]
      },
      {
        "title": "Remote hands",
        "description": "Performs checks for remote technical teams.",
        "mustHave": [
          "Read out status LEDs",
          "Confirm cabling/power state",
          "Take clear photos/notes"
        ],
        "niceToHave": [
          "Out-of-band management checks",
          "Drive/server swap support",
          "Inventory audit"
        ]
      }
    ],
    "typicalEvidence": [
      "Remote hands tickets",
      "Rack/patch records",
      "Asset audit examples",
      "Data centre references"
    ],
    "productKnowledgeTags": [
      "dell",
      "hp",
      "lenovo",
      "cisco",
      "vmware",
      "hyper-v",
      "fibre-basics"
    ],
    "skillGroups": [
      {
        "title": "Must-have: data centre support",
        "description": "Core DC technician skills.",
        "skills": [
          {
            "name": "Follow detailed change instructions",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Rack and patch equipment carefully",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Read and update asset labels",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Confirm power and link state",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Provide remote-hands observations",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Document work with clear notes",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Work within change windows",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Server hardware replacement",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Fibre patching awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Out-of-band management awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Asset audit support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Storage/SAN awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Remote console support",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "database-data-platform-support-technician",
    "title": "Database / Data Platform Support Technician",
    "planLevel": "paid-specialist",
    "category": "data",
    "summary": "Data platform support role for database access, backups, basic query support, monitoring, permissions, job failures and escalation.",
    "suitableFor": [
      "Application support",
      "Data platforms",
      "Reporting environments",
      "Internal IT",
      "Managed services"
    ],
    "mustHaveSummary": [
      "Understands database roles, access and backup importance",
      "Can investigate simple database/service issues",
      "Can escalate with logs and impact details"
    ],
    "niceToHaveSummary": [
      "SQL query awareness",
      "SQL Server, PostgreSQL or MySQL exposure",
      "Reporting/BI awareness",
      "Job/agent troubleshooting"
    ],
    "expectedKnowledge": [
      "Tables",
      "Queries",
      "Permissions",
      "Backups",
      "Jobs",
      "Connection strings",
      "Monitoring",
      "Escalation"
    ],
    "roleAspects": [
      {
        "title": "Database support basics",
        "description": "Supports database-backed applications safely.",
        "mustHave": [
          "Connection issue triage",
          "Permission issue awareness",
          "Backup status awareness",
          "Log/error capture"
        ],
        "niceToHave": [
          "Basic SQL queries",
          "Agent/job monitoring",
          "Performance symptom capture"
        ]
      },
      {
        "title": "Data operations",
        "description": "Supports reporting and data users.",
        "mustHave": [
          "User access request support",
          "Report issue triage",
          "Escalation to DBA/developer"
        ],
        "niceToHave": [
          "Power BI awareness",
          "ETL/job awareness",
          "Data quality issue capture"
        ]
      }
    ],
    "typicalEvidence": [
      "Database support tickets",
      "SQL examples",
      "Report support examples",
      "Backup/job evidence"
    ],
    "productKnowledgeTags": [
      "sql-server",
      "postgresql",
      "mysql",
      "power-bi",
      "azure-sql"
    ],
    "skillGroups": [
      {
        "title": "Must-have: database support",
        "description": "Core data platform support skills.",
        "skills": [
          {
            "name": "Database connection issue triage",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "User permission request support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Backup/job status awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Error/log capture",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Escalation with application impact",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Basic reporting issue triage",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Basic SQL query writing",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "SQL Server support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "PostgreSQL support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "MySQL support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Power BI support awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "ETL/job failure awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "data-bi-analyst",
    "title": "Data / BI Analyst",
    "planLevel": "paid-specialist",
    "category": "data",
    "summary": "Data and business intelligence role for reporting, dashboards, data preparation, stakeholder requirements, KPI definition and insight delivery.",
    "suitableFor": [
      "Reporting projects",
      "Operations dashboards",
      "Finance/reporting teams",
      "Sales dashboards",
      "Service analytics",
      "Data clean-up"
    ],
    "mustHaveSummary": [
      "Can gather reporting requirements",
      "Can prepare and validate data",
      "Can build clear dashboards or reports"
    ],
    "niceToHaveSummary": [
      "Power BI, Excel, SQL or data modelling experience",
      "DAX/Power Query awareness",
      "Data governance awareness"
    ],
    "expectedKnowledge": [
      "Data sources",
      "KPIs",
      "Data quality",
      "Reports",
      "Dashboards",
      "Power Query",
      "SQL basics",
      "Stakeholder requirements"
    ],
    "roleAspects": [
      {
        "title": "Reporting delivery",
        "description": "Builds useful reports from defined requirements.",
        "mustHave": [
          "Requirement capture",
          "Data preparation",
          "Report/dashboard creation",
          "User validation"
        ],
        "niceToHave": [
          "DAX measures",
          "Data model design",
          "Scheduled refresh troubleshooting"
        ]
      },
      {
        "title": "Data quality and interpretation",
        "description": "Supports trustworthy reporting.",
        "mustHave": [
          "Validate figures against source",
          "Document assumptions",
          "Explain report meaning"
        ],
        "niceToHave": [
          "Data governance awareness",
          "KPI definition",
          "Stakeholder workshop facilitation"
        ]
      }
    ],
    "typicalEvidence": [
      "Dashboard screenshots",
      "Report examples",
      "SQL/Power Query examples",
      "Stakeholder references"
    ],
    "productKnowledgeTags": [
      "power-bi",
      "excel",
      "sql-server",
      "azure-sql",
      "postgresql",
      "mysql"
    ],
    "skillGroups": [
      {
        "title": "Must-have: BI/reporting",
        "description": "Core data analyst skills.",
        "skills": [
          {
            "name": "Reporting requirement capture",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Data cleaning and preparation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Dashboard/report creation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Data validation against source",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Clear KPI presentation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "User acceptance and feedback handling",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Power BI modelling",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "DAX awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Power Query",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "SQL query writing",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Scheduled refresh support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Data governance awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "devops-automation-engineer",
    "title": "DevOps / Automation Engineer",
    "planLevel": "paid-specialist",
    "category": "devops",
    "summary": "Automation role for scripting, CI/CD, infrastructure-as-code awareness, deployment support, monitoring integration and repeatable operational workflows.",
    "suitableFor": [
      "DevOps teams",
      "Cloud operations",
      "Internal automation",
      "Deployment pipelines",
      "Managed service automation"
    ],
    "mustHaveSummary": [
      "Can script repeatable tasks",
      "Understands source control and deployment workflow",
      "Can support pipelines and operational automation"
    ],
    "niceToHaveSummary": [
      "GitHub Actions/Azure DevOps",
      "Terraform",
      "Docker/Kubernetes awareness",
      "PowerShell/Bash/Python"
    ],
    "expectedKnowledge": [
      "Git",
      "CI/CD",
      "Scripting",
      "IaC",
      "Secrets",
      "Environments",
      "Monitoring",
      "Rollback"
    ],
    "roleAspects": [
      {
        "title": "Automation delivery",
        "description": "Creates repeatable technical workflows.",
        "mustHave": [
          "Script operational tasks",
          "Use source control",
          "Document automation behaviour",
          "Handle errors safely"
        ],
        "niceToHave": [
          "CI/CD pipeline design",
          "Infrastructure as Code",
          "Secrets management"
        ]
      },
      {
        "title": "Deployment support",
        "description": "Supports controlled release activity.",
        "mustHave": [
          "Understand environments",
          "Validate deployment results",
          "Rollback awareness"
        ],
        "niceToHave": [
          "Container awareness",
          "Monitoring integration",
          "Automated tests"
        ]
      }
    ],
    "typicalEvidence": [
      "Script examples",
      "Pipeline examples",
      "Repo links",
      "Automation documentation"
    ],
    "productKnowledgeTags": [
      "powershell",
      "bash",
      "python",
      "github-actions",
      "azure-devops",
      "terraform",
      "docker",
      "kubernetes",
      "ansible"
    ],
    "skillGroups": [
      {
        "title": "Must-have: automation and DevOps",
        "description": "Core automation skills.",
        "skills": [
          {
            "name": "PowerShell, Bash or Python scripting",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Git/source control awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "CI/CD concept awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Deployment validation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Rollback awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Clear automation documentation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Safe error handling",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "GitHub Actions",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Azure DevOps pipelines",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Terraform",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Docker awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Kubernetes awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Ansible automation",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "it-project-manager",
    "title": "IT Project Coordinator / Project Manager",
    "planLevel": "paid-specialist",
    "category": "management",
    "summary": "IT project role for planning, coordination, stakeholder communication, risk, change, rollout control, supplier management and handover.",
    "suitableFor": [
      "IT rollouts",
      "Migration projects",
      "Office moves",
      "Security projects",
      "Infrastructure refresh",
      "Cloud adoption"
    ],
    "mustHaveSummary": [
      "Can coordinate tasks, resources and stakeholders",
      "Can manage risks, issues and status reporting",
      "Understands IT change and handover needs"
    ],
    "niceToHaveSummary": [
      "Agile/PRINCE2 awareness",
      "Migration planning",
      "Supplier coordination",
      "Change advisory process"
    ],
    "expectedKnowledge": [
      "Scope",
      "Plan",
      "RAID",
      "Change",
      "Dependencies",
      "Stakeholders",
      "Handover",
      "Rollout"
    ],
    "roleAspects": [
      {
        "title": "Project control",
        "description": "Keeps IT work organised and visible.",
        "mustHave": [
          "Scope tracking",
          "Plan and milestone tracking",
          "Risk/issue management",
          "Stakeholder updates"
        ],
        "niceToHave": [
          "Budget tracking",
          "Change advisory process",
          "Supplier management"
        ]
      },
      {
        "title": "IT delivery awareness",
        "description": "Understands technical delivery enough to coordinate it.",
        "mustHave": [
          "Migration/change window awareness",
          "User communication planning",
          "Handover documentation"
        ],
        "niceToHave": [
          "Testing/UAT coordination",
          "Training rollout",
          "Multi-site deployment"
        ]
      }
    ],
    "typicalEvidence": [
      "Project plans",
      "Status reports",
      "RAID logs",
      "Handover packs"
    ],
    "productKnowledgeTags": [
      "microsoft-project",
      "jira",
      "azure-devops",
      "servicenow",
      "microsoft-365"
    ],
    "skillGroups": [
      {
        "title": "Must-have: IT project coordination",
        "description": "Core IT PM skills.",
        "skills": [
          {
            "name": "Scope and milestone tracking",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Task and dependency coordination",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Risk and issue logging",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Stakeholder communication",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Change window planning",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "User communication coordination",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Handover documentation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Agile or PRINCE2 awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Budget tracking",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Supplier coordination",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "UAT planning",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Multi-site rollout management",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "CAB/change advisory process",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "it-technical-consultant-solutions-architect",
    "title": "IT Technical Consultant / Solutions Architect",
    "planLevel": "paid-specialist",
    "category": "consultancy",
    "summary": "Consultancy role for discovery, requirements capture, solution design, migration strategy, documentation, stakeholder workshops and technical recommendations.",
    "suitableFor": [
      "Pre-sales discovery",
      "Solution design",
      "Cloud migration planning",
      "Infrastructure refresh",
      "Security improvement projects",
      "Board-level technical planning"
    ],
    "mustHaveSummary": [
      "Can run discovery and translate requirements into technical options",
      "Can document solution designs and risks",
      "Can communicate technical choices to non-technical stakeholders"
    ],
    "niceToHaveSummary": [
      "Architecture diagrams",
      "Microsoft/cloud/security/network design depth",
      "Commercial awareness",
      "Migration roadmap creation"
    ],
    "expectedKnowledge": [
      "Discovery",
      "Requirements",
      "Architecture",
      "Risks",
      "Options",
      "Migration planning",
      "Stakeholder communication",
      "Documentation"
    ],
    "roleAspects": [
      {
        "title": "Discovery and design",
        "description": "Turns business and technical needs into viable options.",
        "mustHave": [
          "Stakeholder discovery",
          "Requirement capture",
          "Current-state assessment",
          "Target-state design"
        ],
        "niceToHave": [
          "Business case support",
          "Cost/risk comparison",
          "Roadmap development"
        ]
      },
      {
        "title": "Technical recommendation",
        "description": "Communicates and documents options clearly.",
        "mustHave": [
          "Design documentation",
          "Risk and dependency notes",
          "Assumption tracking"
        ],
        "niceToHave": [
          "Architecture diagrams",
          "Vendor selection support",
          "Migration strategy"
        ]
      }
    ],
    "typicalEvidence": [
      "Design documents",
      "Discovery notes",
      "Architecture diagrams",
      "Roadmaps",
      "Client references"
    ],
    "productKnowledgeTags": [
      "microsoft-365",
      "azure",
      "aws",
      "google-cloud",
      "entra-id",
      "fortinet",
      "cisco",
      "vmware",
      "veeam",
      "intune"
    ],
    "skillGroups": [
      {
        "title": "Must-have: consultancy and architecture",
        "description": "Core IT consultant skills.",
        "skills": [
          {
            "name": "Stakeholder discovery",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Requirements capture",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Current-state assessment",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Target-state design",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Risk and dependency documentation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Technical option comparison",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Non-technical stakeholder communication",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Architecture diagram creation",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Cloud migration roadmap",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Security improvement planning",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Vendor/platform selection",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Business case support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Workshop facilitation",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "pos-epos-retail-it-engineer",
    "title": "POS / EPOS / Retail IT Field Engineer",
    "planLevel": "paid-specialist",
    "category": "field-service",
    "summary": "Retail IT role for POS terminals, receipt printers, barcode scanners, payment device coordination, store networks, back-office PCs and retail rollout support.",
    "suitableFor": [
      "Retail stores",
      "Hospitality POS",
      "Multi-site rollouts",
      "EPOS support",
      "Branch refresh projects"
    ],
    "mustHaveSummary": [
      "Can support POS/EPOS endpoint setup and fault response",
      "Can validate printers, scanners and network connectivity",
      "Can work around trading environments"
    ],
    "niceToHaveSummary": [
      "Payment device coordination awareness",
      "Store network awareness",
      "Retail rollout experience",
      "Vendor escalation"
    ],
    "expectedKnowledge": [
      "POS terminals",
      "Receipt printers",
      "Barcode scanners",
      "Store network",
      "Back-office PC",
      "Payment device boundaries",
      "Trading impact"
    ],
    "roleAspects": [
      {
        "title": "Retail endpoint support",
        "description": "Supports retail technology in live trading environments.",
        "mustHave": [
          "POS terminal support",
          "Printer/scanner validation",
          "Back-office PC awareness",
          "Store user communication"
        ],
        "niceToHave": [
          "Payment device coordination",
          "Stockroom/warehouse device support",
          "Kiosk/self-service awareness"
        ]
      },
      {
        "title": "Store rollout and fault response",
        "description": "Supports multi-site changes and break-fix visits.",
        "mustHave": [
          "Follow rollout checklist",
          "Validate transactions/workflow where permitted",
          "Document site outcome"
        ],
        "niceToHave": [
          "Out-of-hours rollout work",
          "Vendor escalation",
          "Branch network triage"
        ]
      }
    ],
    "typicalEvidence": [
      "Retail visit records",
      "Rollout checklists",
      "POS support tickets",
      "Store references"
    ],
    "productKnowledgeTags": [
      "epos-now",
      "square",
      "zebra",
      "epson-printers",
      "windows-11",
      "unifi",
      "meraki"
    ],
    "skillGroups": [
      {
        "title": "Must-have: retail IT support",
        "description": "Core POS/EPOS support skills.",
        "skills": [
          {
            "name": "POS/EPOS endpoint setup support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Receipt printer and scanner support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Store network connectivity checks",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Back-office PC support awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Follow store rollout checklists",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Work around live trading environments",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Document store visit outcomes",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Payment device coordination awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Zebra device support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Epson receipt printer support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Multi-site rollout experience",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Retail kiosk support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Vendor escalation",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "printer-mfd-support-technician",
    "title": "Printer / MFD Support Technician",
    "planLevel": "paid-specialist",
    "category": "field-service",
    "summary": "Printer and multifunction device support role for user printing issues, driver deployment, scan-to-email, secure print, queues, basic connectivity and vendor escalation.",
    "suitableFor": [
      "Office print support",
      "Education estates",
      "Managed print",
      "Field service",
      "Helpdesk escalation"
    ],
    "mustHaveSummary": [
      "Can support common print, scan and queue issues",
      "Can document device and user impact",
      "Can coordinate vendor escalation when hardware faults are likely"
    ],
    "niceToHaveSummary": [
      "Print server awareness",
      "Secure print solutions",
      "Scan-to-email troubleshooting",
      "MFD address book/workflow awareness"
    ],
    "expectedKnowledge": [
      "Print queues",
      "Drivers",
      "Scan-to-email",
      "SMTP basics",
      "Address books",
      "Secure print",
      "Paper/consumables impact",
      "Connectivity"
    ],
    "roleAspects": [
      {
        "title": "Print support",
        "description": "Resolves practical print and scan issues.",
        "mustHave": [
          "Print queue checks",
          "Driver issue triage",
          "User mapping support",
          "Basic device connectivity checks"
        ],
        "niceToHave": [
          "Print server support",
          "Secure print platform awareness",
          "MFD workflow setup"
        ]
      },
      {
        "title": "Scan and workflow support",
        "description": "Supports common MFD workflow issues.",
        "mustHave": [
          "Scan-to-email symptom capture",
          "Address book awareness",
          "SMTP setting awareness"
        ],
        "niceToHave": [
          "Scan-to-folder awareness",
          "Pull-print support",
          "Vendor escalation process"
        ]
      }
    ],
    "typicalEvidence": [
      "Print support tickets",
      "MFD rollout examples",
      "Scan workflow support notes"
    ],
    "productKnowledgeTags": [
      "hp",
      "canon",
      "ricoh",
      "xerox",
      "epson-printers",
      "papercut",
      "uniflow",
      "windows-server"
    ],
    "skillGroups": [
      {
        "title": "Must-have: print and MFD support",
        "description": "Core print support skills.",
        "skills": [
          {
            "name": "Printer queue issue triage",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Driver support awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "User printer mapping support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Basic device connectivity checks",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Scan-to-email symptom capture",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Address book/workflow awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Vendor escalation notes",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Print server support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "PaperCut awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "uniFLOW awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Scan-to-folder support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Secure print awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "MFD fleet rollout support",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  }
];

export const itSkillProfileCategories = [
  "support",
  "field-service",
  "infrastructure",
  "networking",
  "wireless",
  "systems",
  "cloud",
  "security",
  "data",
  "devops",
  "management",
  "consultancy",
  "specialist"
] as const;
