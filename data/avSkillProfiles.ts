import type { AvSkillProfile } from "../types/skillProfiles";

export const avSkillProfiles: AvSkillProfile[] = [
  {
    "id": "free-basic-av-installation-engineer",
    "title": "Free Basic AV Installation Engineer",
    "planLevel": "free-basic",
    "category": "installation",
    "summary": "Entry-level AV installation profile for people with practical exposure to basic AV cabling, signal paths, terminations, product awareness and supervised installation work.",
    "suitableFor": [
      "Basic AV installation support",
      "Cable pulling and labelling",
      "Display installation assistance",
      "Rack build assistance",
      "Meeting-room installation support",
      "First-fix and second-fix support under supervision"
    ],
    "mustHaveSummary": [
      "Recognises common AV cable types and their purpose",
      "Understands basic source-to-display signal flow",
      "Can follow a cable schedule, basic drawing or instruction from a lead engineer",
      "Can route, dress and label cables neatly",
      "Can work safely under supervision"
    ],
    "niceToHaveSummary": [
      "RJ45 termination awareness",
      "Basic HDBaseT, USB and networked AV awareness",
      "Basic exposure to recognised AV brands",
      "Basic awareness of EDID, HDCP, resolution and distance issues"
    ],
    "expectedKnowledge": [
      "HDMI, USB, CAT cable, speaker cable, control cable and basic audio cable identification",
      "Source, switcher, extender, receiver, processor and display signal flow",
      "Basic cable segregation and labelling principles",
      "Difference between data networking and AV-over-CAT / AV-over-IP use cases",
      "Why distance, resolution, cable quality and termination can affect performance"
    ],
    "roleAspects": [
      {
        "title": "Basic AV installation support",
        "description": "Can support practical installation activity without claiming specialist commissioning capability.",
        "mustHave": [
          "Cable pulling",
          "Cable labelling",
          "Following drawings",
          "Working under supervision"
        ],
        "niceToHave": [
          "RJ45 termination",
          "Rack wiring support",
          "Basic signal checks"
        ]
      },
      {
        "title": "Basic product awareness",
        "description": "Has seen or assisted with common AV product categories.",
        "mustHave": [
          "Displays",
          "HDMI cabling",
          "USB devices",
          "Speakers or microphones"
        ],
        "niceToHave": [
          "Extenders",
          "Matrices",
          "Wireless presentation",
          "Meeting-room bars",
          "AVoIP endpoints"
        ]
      }
    ],
    "typicalEvidence": [
      "Sites assisted on",
      "Lead engineer reference",
      "Photos of labelled cabling or neat installation work",
      "Product categories or brands worked around"
    ],
    "productKnowledgeTags": [
      "hdmi",
      "usb-byod-byom",
      "hdbaset",
      "wyrestorm",
      "extron",
      "logitech",
      "samsung",
      "lg"
    ],
    "skillGroups": [
      {
        "title": "Must-have: basic AV cables and signal flow",
        "description": "Minimum practical knowledge needed to claim basic AV installation experience.",
        "skills": [
          {
            "name": "Identify HDMI, USB, CAT, speaker, control and basic audio cables",
            "level": "foundation",
            "priority": "must-have"
          },
          {
            "name": "Understand source-to-display signal flow",
            "level": "foundation",
            "priority": "must-have"
          },
          {
            "name": "Understand source, switcher, extender, receiver, processor and display roles",
            "level": "foundation",
            "priority": "must-have"
          },
          {
            "name": "Follow cable schedules and basic drawings",
            "level": "foundation",
            "priority": "must-have"
          },
          {
            "name": "Route, dress and label cables neatly",
            "level": "foundation",
            "priority": "must-have"
          },
          {
            "name": "Understand that distance, resolution and cable quality affect AV performance",
            "level": "foundation",
            "priority": "must-have"
          },
          {
            "name": "Work safely under instruction from a lead engineer",
            "level": "foundation",
            "priority": "must-have"
          },
          {
            "name": "RJ45 termination awareness",
            "level": "foundation",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic HDBaseT awareness",
            "level": "foundation",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic USB/BYOD awareness",
            "level": "foundation",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic analogue and digital audio awareness",
            "level": "foundation",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic EDID / HDCP awareness",
            "level": "foundation",
            "priority": "nice-to-have"
          },
          {
            "name": "Awareness of matrices, switchers, extenders and AVoIP",
            "level": "foundation",
            "priority": "nice-to-have"
          },
          {
            "name": "Recognised AV brand exposure",
            "level": "foundation",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "av-installation-engineer",
    "title": "AV Installation Engineer",
    "planLevel": "paid-specialist",
    "category": "installation",
    "summary": "Practical AV installer capable of second-fix installation, mounting, equipment connection, cable dressing, basic testing and preparing systems for commissioning.",
    "suitableFor": [
      "Meeting rooms",
      "Classrooms",
      "Retail AV",
      "Hospitality AV",
      "Boardrooms",
      "General commercial AV"
    ],
    "mustHaveSummary": [
      "Can install displays, speakers, cameras and room hardware neatly",
      "Can follow drawings, schematics and cable schedules",
      "Can complete second-fix AV installation and basic validation"
    ],
    "niceToHaveSummary": [
      "Basic commissioning support",
      "HDBaseT and AVoIP installation awareness",
      "Experience with UC rooms and wireless presentation systems"
    ],
    "expectedKnowledge": [
      "AV signal paths",
      "Cable containment and segregation",
      "Mounting and installation quality",
      "Basic video, audio and USB validation",
      "Escalation of technical issues"
    ],
    "typicalEvidence": [
      "Completed installation examples",
      "Lead engineer references",
      "Site photos",
      "Snagging records"
    ],
    "productKnowledgeTags": [
      "wyrestorm",
      "extron",
      "kramer",
      "logitech",
      "yealink",
      "barco-clickshare",
      "hdbaset",
      "usb-byod-byom"
    ],
    "roleAspects": [
      {
        "title": "Second-fix installation",
        "description": "Can install and connect visible room hardware in a clean and serviceable way.",
        "mustHave": [
          "Display and mount support",
          "Cable connection",
          "Drawing interpretation",
          "Labelling"
        ],
        "niceToHave": [
          "Basic bracket setting-out",
          "Basic room handover checks"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: installation delivery",
        "description": "Core second-fix AV installation skills.",
        "skills": [
          {
            "name": "Display and bracket installation awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Camera, microphone and speaker installation support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "AV cable routing, dressing and labelling",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Reading AV drawings and cable schedules",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Connecting sources, switchers, extenders and displays",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Basic signal validation before commissioning",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Snagging and issue reporting",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "HDBaseT installation experience",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "AVoIP endpoint installation experience",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Wireless presentation installation experience",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "UC camera/audio device installation experience",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic control cabling awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic DSP/audio device wiring awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "av-cable-wireman-first-fix",
    "title": "Cable / Wireman - 1st Fix",
    "planLevel": "paid-specialist",
    "category": "installation",
    "summary": "First-fix cabling role for cable pulling, labelling, containment coordination, infrastructure installation and preparing spaces for AV equipment.",
    "suitableFor": [
      "Construction sites",
      "Office fit-outs",
      "Education projects",
      "Retail",
      "Hospitality",
      "Infrastructure works"
    ],
    "mustHaveSummary": [
      "Can pull, route and label AV cables",
      "Can follow cable schedules and drawings",
      "Understands cable segregation and site working"
    ],
    "niceToHaveSummary": [
      "RJ45 termination",
      "Fibre handling awareness",
      "M&E and main contractor coordination"
    ],
    "expectedKnowledge": [
      "Cable routes",
      "Containment",
      "Segregation",
      "Cable labelling",
      "Drawing interpretation",
      "Basic AV cable purpose"
    ],
    "typicalEvidence": [
      "Cable pull references",
      "Termination photos",
      "Test sheets",
      "Site supervisor reference"
    ],
    "productKnowledgeTags": [
      "hdmi",
      "hdbaset",
      "av-over-ip",
      "usb-byod-byom"
    ],
    "roleAspects": [
      {
        "title": "Infrastructure installation",
        "description": "Gets the right cables to the right places and leaves them identifiable for later installation/commissioning.",
        "mustHave": [
          "Pulling cables",
          "Labelling cables",
          "Following drawings",
          "Cable segregation"
        ],
        "niceToHave": [
          "RJ45 termination",
          "Basic cable testing"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: first-fix cabling",
        "description": "Core infrastructure and cable installation capability.",
        "skills": [
          {
            "name": "Cable pulling",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Cable route following",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Cable labelling to schedule",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Reading drawings and cable schedules",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Cable segregation awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Site health and safety awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Working around other trades",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "RJ45 termination",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "AV connector termination",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Speaker cable termination",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Continuity testing awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Fibre handling awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "av-rack-builder",
    "title": "Rack Building Technician",
    "planLevel": "paid-specialist",
    "category": "installation",
    "summary": "Workshop or site-based rack builder capable of equipment mounting, rack wiring, dressing, labelling and preparing racks for commissioning.",
    "suitableFor": [
      "Rack pre-build",
      "Control rooms",
      "AV workshops",
      "Multi-room rollouts",
      "Education and corporate AV"
    ],
    "mustHaveSummary": [
      "Can follow rack elevations and wiring schedules",
      "Can wire and dress racks neatly",
      "Can label and prepare systems for commissioning"
    ],
    "niceToHaveSummary": [
      "Power distribution awareness",
      "Thermal and ventilation awareness",
      "Pre-commissioning checks"
    ],
    "expectedKnowledge": [
      "Rack elevations",
      "Cable dressing",
      "Signal separation",
      "Labelling",
      "Power and ventilation awareness",
      "Commissioning readiness"
    ],
    "typicalEvidence": [
      "Rack build photos",
      "Label examples",
      "Workshop references",
      "Build checklists"
    ],
    "productKnowledgeTags": [
      "wyrestorm",
      "extron",
      "crestron",
      "qsys",
      "biamp",
      "hdbaset",
      "av-over-ip"
    ],
    "roleAspects": [
      {
        "title": "Rack build readiness",
        "description": "Builds clean racks ready for commissioning rather than only mounting equipment.",
        "mustHave": [
          "Rack elevation reading",
          "Cable dressing",
          "Cable labelling",
          "Signal separation"
        ],
        "niceToHave": [
          "Firmware support",
          "Power-up checks"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: rack build practice",
        "description": "Core rack build skills.",
        "skills": [
          {
            "name": "Read rack elevations",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Mount rack equipment cleanly",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Dress and loom cables neatly",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Label cables and equipment clearly",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Separate power, data, audio and video sensibly",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Prepare racks for commissioning handover",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Thermal spacing and ventilation awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Power distribution awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Firmware loading support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Basic signal checks",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Rack build documentation",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "av-lead-engineer-site-manager",
    "title": "Lead Engineer / Site Manager",
    "planLevel": "paid-specialist",
    "category": "management",
    "summary": "Senior site role coordinating engineers, daily installation activity, quality checks, site communication, snags and readiness for commissioning.",
    "suitableFor": [
      "Multi-engineer projects",
      "Large installations",
      "Education rollouts",
      "Corporate floors",
      "Venue projects"
    ],
    "mustHaveSummary": [
      "Can lead installation teams",
      "Can manage daily tasks and quality control",
      "Can communicate with project managers, main contractors and clients"
    ],
    "niceToHaveSummary": [
      "Pre-commissioning checks",
      "Mentoring installers",
      "Daily reports and snag management"
    ],
    "expectedKnowledge": [
      "Site coordination",
      "AV installation sequencing",
      "Quality control",
      "Drawings and cable schedules",
      "Risk and escalation",
      "Snag control"
    ],
    "typicalEvidence": [
      "Lead engineer references",
      "Site reports",
      "Snagging records",
      "Team size examples"
    ],
    "productKnowledgeTags": [
      "wyrestorm",
      "extron",
      "crestron",
      "qsys",
      "biamp",
      "hdbaset",
      "av-over-ip",
      "usb-byod-byom"
    ],
    "roleAspects": [
      {
        "title": "Site leadership",
        "description": "Coordinates people, quality and blockers on site.",
        "mustHave": [
          "Daily briefing",
          "Task allocation",
          "Quality control",
          "Stakeholder updates"
        ],
        "niceToHave": [
          "Mentoring",
          "Readiness reporting"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: site leadership",
        "description": "Core lead engineer responsibilities.",
        "skills": [
          {
            "name": "Daily team briefing",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Task allocation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Progress tracking",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Quality control checks",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Snagging management",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Main contractor and client communication",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Escalation of blockers",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Schematic interpretation",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Cable schedule verification",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Rack and equipment installation checks",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Pre-commissioning readiness checks",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Installer mentoring",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "av-service-fault-engineer",
    "title": "AV Service / Fault Engineer",
    "planLevel": "paid-specialist",
    "category": "service",
    "summary": "Service role for diagnosing, documenting and resolving AV faults in installed systems and live customer environments.",
    "suitableFor": [
      "Break-fix calls",
      "Maintenance contracts",
      "Education estates",
      "Corporate meeting rooms",
      "Hospitality venues"
    ],
    "mustHaveSummary": [
      "Can trace AV signal paths",
      "Can diagnose common audio, video, USB and control faults",
      "Can communicate clearly with customers and document findings"
    ],
    "niceToHaveSummary": [
      "Networked AV troubleshooting",
      "Manufacturer escalation experience",
      "Temporary workaround creation"
    ],
    "expectedKnowledge": [
      "Signal path diagnosis",
      "HDMI, HDBaseT, USB, audio and control faults",
      "Customer communication",
      "Service reporting",
      "Escalation"
    ],
    "typicalEvidence": [
      "Service reports",
      "Fault logs",
      "Maintenance references",
      "Known platform support experience"
    ],
    "productKnowledgeTags": [
      "hdmi",
      "hdbaset",
      "av-over-ip",
      "usb-byod-byom",
      "wyrestorm",
      "extron",
      "qsys",
      "biamp",
      "shure"
    ],
    "roleAspects": [
      {
        "title": "Fault diagnosis",
        "description": "Identifies and documents the cause rather than only replacing devices.",
        "mustHave": [
          "Signal path tracing",
          "Clear reporting",
          "Customer communication"
        ],
        "niceToHave": [
          "Remote support",
          "Manufacturer escalation"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: fault diagnosis",
        "description": "Core AV service skills.",
        "skills": [
          {
            "name": "Signal path tracing",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "HDMI / HDBaseT fault diagnosis",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "USB and conferencing fault diagnosis",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Audio fault diagnosis",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Control fault identification",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Clear service reporting",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Networked AV fault diagnosis",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Intermittent fault investigation",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Temporary workaround creation",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Manufacturer escalation",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Remote support diagnosis",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "uc-meeting-room-engineer",
    "title": "UC / Meeting Room Engineer",
    "planLevel": "paid-specialist",
    "category": "commissioning",
    "summary": "Meeting-room engineer for Teams, Zoom, BYOD/BYOM, cameras, microphones, speakers, USB routing and user validation.",
    "suitableFor": [
      "Meeting rooms",
      "Boardrooms",
      "Huddle rooms",
      "Training rooms",
      "Hybrid workspaces"
    ],
    "mustHaveSummary": [
      "Understands UC room signal flow",
      "Can test cameras, microphones, speakers and USB routes",
      "Can support basic user handover"
    ],
    "niceToHaveSummary": [
      "Teams and Zoom platform awareness",
      "BYOD/BYOM switching",
      "Camera presets and audio pickup validation"
    ],
    "expectedKnowledge": [
      "USB devices",
      "Camera and audio routing",
      "BYOD/BYOM",
      "Wireless presentation",
      "Test calls",
      "User handover"
    ],
    "typicalEvidence": [
      "Meeting-room references",
      "UC platform experience",
      "Room validation checklists"
    ],
    "productKnowledgeTags": [
      "usb-byod-byom",
      "logitech",
      "yealink",
      "poly",
      "jabra",
      "huddly",
      "barco-clickshare",
      "shure",
      "biamp",
      "sennheiser"
    ],
    "roleAspects": [
      {
        "title": "Room validation",
        "description": "Confirms that the room works from the user€™s point of view.",
        "mustHave": [
          "Camera/audio checks",
          "Test calls",
          "USB path validation"
        ],
        "niceToHave": [
          "Camera presets",
          "BYOM switching"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: meeting-room validation",
        "description": "Core meeting-room skills.",
        "skills": [
          {
            "name": "Understand UC room signal flow",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "USB camera/audio routing awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Test Teams, Zoom or Webex calls",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Validate microphone pickup",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Validate speaker playback",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Support user handover",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "BYOD/BYOM switching",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Camera framing and presets",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Ceiling microphone setup",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Wireless presentation setup",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "USB extender and USB switcher awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "live-event-engineer",
    "title": "Live Event Engineer",
    "planLevel": "paid-specialist",
    "category": "live-events",
    "summary": "Live production engineer for concerts, theatre, touring, festivals, stage AV, temporary systems and show-critical troubleshooting.",
    "suitableFor": [
      "Concerts",
      "Festivals",
      "Touring productions",
      "Theatre",
      "Performance venues",
      "Temporary event systems"
    ],
    "mustHaveSummary": [
      "Understands live event discipline and timing",
      "Can work under show pressure",
      "Can support live audio, video or stage workflows"
    ],
    "niceToHaveSummary": [
      "FOH or monitor console operation",
      "Wireless microphone coordination",
      "LED, camera or playback system awareness"
    ],
    "expectedKnowledge": [
      "Show schedules",
      "Comms",
      "Stage signal flow",
      "Load-in/load-out",
      "Live troubleshooting",
      "Production team communication"
    ],
    "typicalEvidence": [
      "Show call sheets",
      "Venue references",
      "Console/platform experience",
      "Event roles completed"
    ],
    "productKnowledgeTags": [
      "allen-heath",
      "digico",
      "midas",
      "yamaha-audio",
      "ndi",
      "streaming-recording",
      "novastar",
      "brompton"
    ],
    "roleAspects": [
      {
        "title": "Show-critical delivery",
        "description": "Works safely and quickly in live event conditions.",
        "mustHave": [
          "Show timing",
          "Comms discipline",
          "Load-in/load-out",
          "Live fault response"
        ],
        "niceToHave": [
          "FOH/monitor console",
          "LED/playback/camera"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: live event delivery",
        "description": "Core event working skills.",
        "skills": [
          {
            "name": "Work to show schedules and cue times",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Load-in and load-out awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Comms and show-call discipline",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Stage patching and signal flow awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Live fault response under pressure",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Safe working around production teams",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "FOH console operation",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Monitor console operation",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Wireless microphone coordination",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Live camera routing",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "LED wall signal support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Playback/media server awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "live-conferencing-technician",
    "title": "Live Conferencing / Exhibition Technician",
    "planLevel": "paid-specialist",
    "category": "live-events",
    "summary": "Technician for conferences, exhibitions, trade shows, product launches, breakout rooms, hybrid events and speaker support.",
    "suitableFor": [
      "Trade shows",
      "Exhibitions",
      "Conferences",
      "Breakout rooms",
      "Hybrid events",
      "Product launches"
    ],
    "mustHaveSummary": [
      "Can support presenter laptops, microphones and displays",
      "Understands show agenda and room turnover pressure",
      "Can communicate with presenters and event teams"
    ],
    "niceToHaveSummary": [
      "Hybrid event platforms",
      "Streaming and recording",
      "Remote contributor tests"
    ],
    "expectedKnowledge": [
      "Presentation switching",
      "Microphones and Q&A",
      "Hybrid meeting platforms",
      "Exhibition stand support",
      "Speaker-ready rooms"
    ],
    "typicalEvidence": [
      "Conference references",
      "Hybrid event examples",
      "Show-day support records"
    ],
    "productKnowledgeTags": [
      "usb-byod-byom",
      "barco-clickshare",
      "logitech",
      "yealink",
      "poly",
      "ndi",
      "streaming-recording",
      "brightsign"
    ],
    "roleAspects": [
      {
        "title": "Conference support",
        "description": "Supports presentation-led events where smooth agenda flow matters.",
        "mustHave": [
          "Presenter support",
          "Switching/cueing",
          "Panel microphones",
          "Agenda support"
        ],
        "niceToHave": [
          "Remote contributors",
          "Streaming"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: conference support",
        "description": "Core live conferencing skills.",
        "skills": [
          {
            "name": "Presenter laptop testing",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Presentation switching and cueing",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Panel and Q&A microphone support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Confidence monitor support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Agenda and room turnover support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Presenter and organiser communication",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Zoom / Teams / Webex event support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Remote contributor testing",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Streaming encoder awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Recording checks and file handover",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Exhibition stand demo support",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "control-system-programmer",
    "title": "Control System Programmer",
    "planLevel": "paid-specialist",
    "category": "programming",
    "summary": "Programmer for AV control interfaces, room logic, device control, automation, APIs and control system commissioning.",
    "suitableFor": [
      "Boardrooms",
      "Lecture theatres",
      "Auditoriums",
      "Multi-room AV",
      "Hospitality and venue control"
    ],
    "mustHaveSummary": [
      "Understands AV control logic",
      "Can test device control protocols",
      "Can produce usable room-control workflows"
    ],
    "niceToHaveSummary": [
      "Crestron, Extron, Q-SYS or AMX",
      "API, TCP/IP, RS-232, IR and relay control",
      "Touch panel UI design"
    ],
    "expectedKnowledge": [
      "Room modes",
      "Device protocols",
      "Control UI",
      "Source, display and audio control",
      "Fault handling",
      "Documentation"
    ],
    "typicalEvidence": [
      "Control certifications",
      "Touch panel examples",
      "Driver/API examples",
      "Commissioning sign-offs"
    ],
    "productKnowledgeTags": [
      "crestron",
      "extron",
      "qsys",
      "kramer",
      "lightware",
      "atlona"
    ],
    "roleAspects": [
      {
        "title": "Control logic and UI",
        "description": "Builds control workflows that non-technical users can operate.",
        "mustHave": [
          "Room modes",
          "Device protocols",
          "Source/display/audio control"
        ],
        "niceToHave": [
          "Custom APIs",
          "Touch panel UI"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: control logic",
        "description": "Core programming capability.",
        "skills": [
          {
            "name": "Source and display control logic",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Volume and mute control logic",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Room mode workflows",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Device protocol testing",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Error handling and user prompts",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Control system documentation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Crestron programming",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Extron control programming",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Q-SYS control scripting",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "AMX programming",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "REST, JSON and TCP/IP control",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "RS-232, IR and relay control",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "audio-commissioning-engineer",
    "title": "Audio Commissioning Engineer",
    "planLevel": "paid-specialist",
    "category": "commissioning",
    "summary": "Audio commissioning role covering DSP, gain structure, AEC, microphones, loudspeakers, acoustic behaviour, sound mapping and handover.",
    "suitableFor": [
      "Meeting rooms",
      "Lecture theatres",
      "Auditoriums",
      "Houses of worship",
      "Performance spaces",
      "Hospitality venues"
    ],
    "mustHaveSummary": [
      "Can commission DSP routing and gain structure",
      "Understands AEC and conferencing audio",
      "Can validate microphones and loudspeakers"
    ],
    "niceToHaveSummary": [
      "Acoustics, RT60 and STI awareness",
      "Sound mapping and coverage planning",
      "Q-SYS, Biamp and Shure experience"
    ],
    "expectedKnowledge": [
      "DSP routing",
      "Gain structure",
      "AEC",
      "Automixing",
      "Acoustics",
      "Measurement",
      "Speech intelligibility"
    ],
    "typicalEvidence": [
      "DSP files",
      "Measurement screenshots",
      "Commissioning reports",
      "Audio handover records"
    ],
    "productKnowledgeTags": [
      "qsys",
      "biamp",
      "shure",
      "sennheiser",
      "yamaha-audio",
      "dsp-aec"
    ],
    "roleAspects": [
      {
        "title": "Audio performance validation",
        "description": "Validates speech/music performance rather than only confirming sound is present.",
        "mustHave": [
          "Gain structure",
          "AEC",
          "Microphone/loudspeaker validation"
        ],
        "niceToHave": [
          "RT60/STI",
          "Sound mapping"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: audio commissioning",
        "description": "Core audio commissioning skills.",
        "skills": [
          {
            "name": "DSP routing and matrix setup",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Gain structure",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "AEC setup and optimisation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "EQ, gating, compression and automixing",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Microphone and loudspeaker validation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Conferencing audio validation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Q-SYS commissioning",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Biamp Tesira commissioning",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Shure IntelliMix / Microflex setup",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "RT60 and reverberation awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "STI / speech intelligibility awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Sound mapping and speaker coverage",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "video-commissioning-engineer",
    "title": "Video Commissioning Engineer",
    "planLevel": "paid-specialist",
    "category": "commissioning",
    "summary": "Video commissioning role covering HDMI, EDID, HDCP, scaling, matrices, extenders, AVoIP, displays and user acceptance testing.",
    "suitableFor": [
      "Meeting rooms",
      "Lecture theatres",
      "Retail",
      "Hospitality",
      "Command rooms",
      "Multi-display systems"
    ],
    "mustHaveSummary": [
      "Can validate video inputs and outputs",
      "Understands EDID, HDCP and resolution behaviour",
      "Can commission matrix, extender and video routing systems"
    ],
    "niceToHaveSummary": [
      "AVoIP commissioning",
      "HDR and colour space awareness",
      "Multiview and video wall layouts"
    ],
    "expectedKnowledge": [
      "HDMI",
      "EDID",
      "HDCP",
      "Scaling",
      "Resolution and refresh rate",
      "Matrix routing",
      "AVoIP"
    ],
    "typicalEvidence": [
      "Commissioning reports",
      "Input/output test sheets",
      "Video system handover records"
    ],
    "productKnowledgeTags": [
      "hdmi",
      "edid-hdcp",
      "hdbaset",
      "av-over-ip",
      "wyrestorm",
      "extron",
      "kramer",
      "lightware"
    ],
    "roleAspects": [
      {
        "title": "Video signal validation",
        "description": "Confirms sources, routes and display behaviour across expected resolutions and use cases.",
        "mustHave": [
          "EDID/HDCP",
          "Resolution testing",
          "Routing validation"
        ],
        "niceToHave": [
          "HDR/colour space",
          "Multiview"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: video signal commissioning",
        "description": "Core video skills.",
        "skills": [
          {
            "name": "HDMI signal testing",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "EDID management",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "HDCP troubleshooting",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Resolution and refresh-rate validation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Matrix switcher commissioning",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Extender system validation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "AVoIP encoder/decoder commissioning",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "HDR and colour-space awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Multiview setup",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Video wall source layout configuration",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Failover and source-priority testing",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "video-wall-led-specialist",
    "title": "Video Wall / LED Specialist",
    "planLevel": "paid-specialist",
    "category": "specialist",
    "summary": "Specialist role for LCD video walls, LED walls, processors, canvas mapping, scaling, calibration and content-layout validation.",
    "suitableFor": [
      "Retail video walls",
      "LED walls",
      "Command centres",
      "Venues",
      "Reception displays",
      "Broadcast/event backdrops"
    ],
    "mustHaveSummary": [
      "Understands video wall and LED signal chain",
      "Can validate layout, scaling and mapping",
      "Can support processor configuration and handover"
    ],
    "niceToHaveSummary": [
      "Novastar, Brompton or Colorlight experience",
      "Colour calibration",
      "Pixel pitch and viewing-distance awareness"
    ],
    "expectedKnowledge": [
      "Canvas mapping",
      "Scaling",
      "Processor configuration",
      "LED cabinets",
      "LCD bezel compensation",
      "Brightness and colour matching"
    ],
    "typicalEvidence": [
      "Video wall projects",
      "LED processor examples",
      "Commissioning reports",
      "Before/after calibration notes"
    ],
    "productKnowledgeTags": [
      "video-wall-processing",
      "led-processing",
      "novastar",
      "brompton",
      "colorlight",
      "samsung",
      "lg"
    ],
    "roleAspects": [
      {
        "title": "Large visual canvas setup",
        "description": "Ensures the wall presents the intended layout and content correctly.",
        "mustHave": [
          "Signal chain",
          "Canvas mapping",
          "Source validation"
        ],
        "niceToHave": [
          "Colour calibration",
          "Processor-specific configuration"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: video wall delivery",
        "description": "Core visual-system skills.",
        "skills": [
          {
            "name": "Understand video wall signal chain",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Canvas mapping and scaling",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Source layout validation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "LCD bezel compensation awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "LED processor signal flow",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "User acceptance testing",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Novastar configuration",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Brompton configuration",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Colorlight configuration",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Pixel pitch and viewing distance awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Colour calibration and brightness matching",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Multiview/source window configuration",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "avoip-networked-av-engineer",
    "title": "AVoIP / Networked AV Engineer",
    "planLevel": "paid-specialist",
    "category": "commissioning",
    "summary": "Engineer for AV-over-IP systems, endpoints, controllers, multicast-aware deployment, switch coordination and system validation.",
    "suitableFor": [
      "Campus AV",
      "Multi-room systems",
      "Command rooms",
      "Education estates",
      "Large commercial AV"
    ],
    "mustHaveSummary": [
      "Understands encoder, decoder, controller and switch roles",
      "Can configure or validate AVoIP endpoints",
      "Can coordinate with network teams"
    ],
    "niceToHaveSummary": [
      "VLAN and multicast awareness",
      "1GbE versus 10GbE system awareness",
      "Manufacturer-specific AVoIP experience"
    ],
    "expectedKnowledge": [
      "Endpoints",
      "Controllers",
      "IP addressing",
      "VLANs",
      "Multicast awareness",
      "Switch coordination",
      "System validation"
    ],
    "typicalEvidence": [
      "AVoIP projects",
      "Commissioning records",
      "Network coordination examples"
    ],
    "productKnowledgeTags": [
      "av-over-ip",
      "sdvoe",
      "wyrestorm",
      "zeevee",
      "just-add-power",
      "crestron",
      "extron"
    ],
    "roleAspects": [
      {
        "title": "Networked AV deployment",
        "description": "Understands AV endpoint behaviour and works with network teams without pretending every AV engineer is a network engineer.",
        "mustHave": [
          "Endpoint roles",
          "Controller roles",
          "Routing validation"
        ],
        "niceToHave": [
          "VLANs",
          "Multicast/IGMP",
          "SDVoE"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: networked AV basics",
        "description": "Core AVoIP deployment knowledge.",
        "skills": [
          {
            "name": "Understand encoder, decoder and controller roles",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Endpoint configuration and validation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Basic IP addressing awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Coordinate with IT/network teams",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Validate routing between sources and displays",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Document endpoint locations and naming",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "VLAN awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Multicast awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "IGMP awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "1GbE versus 10GbE AV system awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "SDVoE awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Controller/gateway troubleshooting",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "av-design-consultant",
    "title": "AV Design & Consultancy",
    "planLevel": "paid-specialist",
    "category": "design",
    "summary": "Design and consultancy role for requirements capture, schematics, specifications, room data, design reviews and tender support.",
    "suitableFor": [
      "Consultant-led projects",
      "Design and build",
      "Education",
      "Corporate",
      "Hospitality",
      "Early-stage scoping"
    ],
    "mustHaveSummary": [
      "Can capture and translate user requirements",
      "Can produce AV designs and signal-flow documentation",
      "Can write technical specifications"
    ],
    "niceToHaveSummary": [
      "AVoIP, BYOM, audio and video wall design",
      "Tender support",
      "Value engineering"
    ],
    "expectedKnowledge": [
      "Stakeholder discovery",
      "Room use cases",
      "Signal flow",
      "Schematics",
      "Equipment schedules",
      "Specifications",
      "Design risk"
    ],
    "typicalEvidence": [
      "Schematics",
      "Room data sheets",
      "Specifications",
      "Tender responses",
      "Design reviews"
    ],
    "productKnowledgeTags": [
      "wyrestorm",
      "extron",
      "crestron",
      "qsys",
      "biamp",
      "hdbaset",
      "av-over-ip",
      "usb-byod-byom",
      "video-wall-processing"
    ],
    "roleAspects": [
      {
        "title": "Design translation",
        "description": "Turns user requirements into buildable AV system documentation.",
        "mustHave": [
          "Discovery",
          "Signal flow",
          "Specifications"
        ],
        "niceToHave": [
          "Value engineering",
          "Tender support"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: AV design fundamentals",
        "description": "Core design capability.",
        "skills": [
          {
            "name": "Stakeholder discovery",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Functional requirements documentation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "AV schematic design",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Signal flow design",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Equipment schedule support",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Written technical specification",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "AVoIP design awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "USB/BYOD/BYOM design",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Audio coverage and microphone strategy",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Video wall / LED design",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Tender clarification support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Value engineering",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "av-project-manager",
    "title": "AV Project Management",
    "planLevel": "paid-specialist",
    "category": "management",
    "summary": "Project management role for AV project planning, delivery control, stakeholder coordination, risk, scope and handover.",
    "suitableFor": [
      "Commercial rollouts",
      "Education",
      "Hospitality",
      "Multi-room deployments",
      "Large AV programmes"
    ],
    "mustHaveSummary": [
      "Can manage scope, time, resources and risk",
      "Can coordinate stakeholders and engineers",
      "Can manage snagging and handover"
    ],
    "niceToHaveSummary": [
      "Change control",
      "Commercial awareness",
      "Multi-site rollout experience"
    ],
    "expectedKnowledge": [
      "Scope",
      "Programme",
      "Resource planning",
      "Dependencies",
      "Risk",
      "Change control",
      "Handover"
    ],
    "typicalEvidence": [
      "Project plans",
      "Progress reports",
      "RAMS/document packs",
      "Handover packs"
    ],
    "productKnowledgeTags": [
      "hdbaset",
      "av-over-ip",
      "usb-byod-byom",
      "dsp-aec",
      "video-wall-processing"
    ],
    "roleAspects": [
      {
        "title": "Delivery control",
        "description": "Manages delivery momentum and risks rather than only attending meetings.",
        "mustHave": [
          "Scope",
          "Programme",
          "Resources",
          "Risk"
        ],
        "niceToHave": [
          "Change control",
          "Multi-site rollout"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: project control",
        "description": "Core AV project management capability.",
        "skills": [
          {
            "name": "Scope review and delivery planning",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Project programme creation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Resource planning",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Risk and issue management",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Stakeholder communication",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Snagging and handover control",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "AV signal flow awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Containment, power and data coordination",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Commissioning process awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Variation identification",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "O&M and as-built documentation",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "av-site-survey-engineer",
    "title": "AV Site Survey / Technical Survey Engineer",
    "planLevel": "paid-specialist",
    "category": "design",
    "summary": "Survey role for capturing site conditions, dimensions, services, routes, risks and technical constraints before AV design or installation.",
    "suitableFor": [
      "Pre-sales surveys",
      "Pre-installation surveys",
      "Retrofit projects",
      "Multi-site rollouts",
      "Education and corporate estates"
    ],
    "mustHaveSummary": [
      "Can capture accurate site information",
      "Can identify power, data, mounting and route constraints",
      "Can produce clear survey notes and photos"
    ],
    "niceToHaveSummary": [
      "Design risk awareness",
      "Room acoustic awareness",
      "Containment and construction coordination"
    ],
    "expectedKnowledge": [
      "Room dimensions",
      "Construction",
      "Mounting surfaces",
      "Cable routes",
      "Power/data locations",
      "Rack locations",
      "Risk and access"
    ],
    "typicalEvidence": [
      "Survey reports",
      "Photo packs",
      "Room data sheets",
      "Marked-up drawings"
    ],
    "productKnowledgeTags": [
      "projection-edge-blend",
      "video-wall-processing",
      "usb-byod-byom",
      "hdbaset",
      "av-over-ip"
    ],
    "roleAspects": [
      {
        "title": "Survey capture",
        "description": "Collects the information needed to reduce design and install assumptions.",
        "mustHave": [
          "Dimensions",
          "Power/data",
          "Routes",
          "Mounting"
        ],
        "niceToHave": [
          "Sightlines",
          "Acoustics",
          "Marked drawings"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: survey capture",
        "description": "Core technical survey capability.",
        "skills": [
          {
            "name": "Capture room dimensions and photos",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Record power and data availability",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Identify cable routes and containment requirements",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Assess mounting surfaces and display locations",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Capture rack/location constraints",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Report risks and blockers clearly",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Projection throw and sightline awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Acoustic issue awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Networked AV readiness awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Accessibility and usability observation",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Marked-up drawing production",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "digital-signage-engineer",
    "title": "Digital Signage Engineer",
    "planLevel": "paid-specialist",
    "category": "specialist",
    "summary": "Role for installing, configuring and supporting digital signage players, displays, CMS platforms, playlists and signage networks.",
    "suitableFor": [
      "Retail",
      "Corporate comms",
      "Education signage",
      "Hospitality",
      "Transport",
      "Public spaces"
    ],
    "mustHaveSummary": [
      "Can install and validate signage displays and players",
      "Understands content playback and scheduling basics",
      "Can support CMS/player connectivity"
    ],
    "niceToHaveSummary": [
      "BrightSign or CMS platform experience",
      "Network and remote management awareness",
      "Multi-site rollout experience"
    ],
    "expectedKnowledge": [
      "Media players",
      "Displays",
      "CMS",
      "Scheduling",
      "Network connectivity",
      "Content format awareness",
      "Remote support"
    ],
    "typicalEvidence": [
      "Signage rollout examples",
      "CMS experience",
      "Player configuration examples"
    ],
    "productKnowledgeTags": [
      "brightsign",
      "tripleplay",
      "signagelive",
      "samsung",
      "lg",
      "sony",
      "digital-signage-cms"
    ],
    "roleAspects": [
      {
        "title": "Signage workflow",
        "description": "Understands content playback as well as display installation.",
        "mustHave": [
          "Player/display setup",
          "CMS basics",
          "Playback validation"
        ],
        "niceToHave": [
          "Remote management",
          "Multi-site rollout"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: signage deployment",
        "description": "Core digital signage skills.",
        "skills": [
          {
            "name": "Display and player installation awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Basic CMS/player setup",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Playlist and scheduling awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Network connectivity checks",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Content playback validation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Basic signage fault diagnosis",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "BrightSign configuration",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Tripleplay awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Signagelive awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Multi-site signage rollout experience",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Remote player management",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "projection-display-specialist",
    "title": "Projection / Display Specialist",
    "planLevel": "paid-specialist",
    "category": "specialist",
    "summary": "Specialist role for projection, display selection support, image alignment, projection geometry, screen considerations and visual validation.",
    "suitableFor": [
      "Lecture theatres",
      "Auditoriums",
      "Museums",
      "Houses of worship",
      "Corporate presentation spaces",
      "Large venues"
    ],
    "mustHaveSummary": [
      "Understands display and projection signal paths",
      "Can support image alignment and validation",
      "Can identify sightline, brightness and placement issues"
    ],
    "niceToHaveSummary": [
      "Edge blending",
      "Projection mapping awareness",
      "Lens and throw calculation awareness"
    ],
    "expectedKnowledge": [
      "Projection throw",
      "Brightness",
      "Aspect ratio",
      "Screen surfaces",
      "Display resolution",
      "Image geometry",
      "Sightlines"
    ],
    "typicalEvidence": [
      "Projection projects",
      "Display installations",
      "Image alignment notes",
      "Venue references"
    ],
    "productKnowledgeTags": [
      "epson",
      "panasonic",
      "sony",
      "projection-edge-blend",
      "samsung",
      "lg"
    ],
    "roleAspects": [
      {
        "title": "Visual validation",
        "description": "Checks that displays/projection meet the viewing requirement, not only that they power on.",
        "mustHave": [
          "Alignment",
          "Resolution",
          "Brightness"
        ],
        "niceToHave": [
          "Edge blend",
          "Projection mapping"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: display/projection setup",
        "description": "Core display specialist knowledge.",
        "skills": [
          {
            "name": "Display input and resolution validation",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Projection alignment awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Aspect ratio and image geometry awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Brightness and ambient light awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Sightline and screen placement awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Basic display/projector fault diagnosis",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Lens and throw calculation awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Edge blending awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Projection mapping awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Large venue projection support",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Colour and brightness matching",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  },
  {
    "id": "streaming-recording-hybrid-technician",
    "title": "Streaming / Recording / Hybrid Event Technician",
    "planLevel": "paid-specialist",
    "category": "live-events",
    "summary": "Role for supporting streaming, recording, hybrid meetings, encoders, capture devices, remote contributors and file handover.",
    "suitableFor": [
      "Hybrid events",
      "Webinars",
      "Lecture capture",
      "Town halls",
      "Conference streaming",
      "Training recordings"
    ],
    "mustHaveSummary": [
      "Can support camera/audio capture for streaming or recording",
      "Can test remote contributors and basic stream/record status",
      "Can hand over recordings or confirm capture success"
    ],
    "niceToHaveSummary": [
      "NDI awareness",
      "Encoder configuration",
      "Mix-minus and remote contributor workflows"
    ],
    "expectedKnowledge": [
      "Capture devices",
      "Encoders",
      "Audio routing",
      "Remote contributors",
      "Recording checks",
      "Streaming platforms",
      "File handover"
    ],
    "typicalEvidence": [
      "Hybrid event examples",
      "Streaming support references",
      "Recording workflow examples"
    ],
    "productKnowledgeTags": [
      "ndi",
      "streaming-recording",
      "usb-byod-byom",
      "logitech",
      "shure",
      "qsys",
      "barco-clickshare"
    ],
    "roleAspects": [
      {
        "title": "Hybrid event workflow",
        "description": "Supports both local room AV and remote audience/recording requirements.",
        "mustHave": [
          "Capture checks",
          "Remote contributor testing",
          "Recording status"
        ],
        "niceToHave": [
          "NDI",
          "Mix-minus",
          "Backup recording"
        ]
      }
    ],
    "skillGroups": [
      {
        "title": "Must-have: streaming and recording support",
        "description": "Core hybrid event skills.",
        "skills": [
          {
            "name": "Camera and audio capture awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Streaming/recording status checks",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Remote contributor testing",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Recording file handover awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Basic audio/video sync awareness",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "Clear event support communication",
            "level": "intermediate",
            "priority": "must-have"
          },
          {
            "name": "NDI awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Encoder configuration",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Mix-minus awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "OBS, vMix or Wirecast awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          },
          {
            "name": "Backup recording workflow awareness",
            "level": "intermediate",
            "priority": "nice-to-have"
          }
        ]
      }
    ]
  }
];

export const avSkillProfileCategories = [
  "installation",
  "commissioning",
  "programming",
  "live-events",
  "design",
  "management",
  "service",
  "product-awareness",
  "specialist"
] as const;

