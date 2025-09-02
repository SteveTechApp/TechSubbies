import React from 'react';

// --- Professional, Thematic Hero Images ---
export const HERO_IMAGES = {
  landing: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop', // circuit board
    'https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=2070&auto=format&fit=crop', // retro tech
    'https://images.unsplash.com/photo-1614113489855-474aa913b438?q=80&w=1974&auto=format&fit=crop', // audio mixer
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop', // server room
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop', // network globe
  ],
  engineers: [
    'https://images.unsplash.com/photo-1581092921462-205273467433?q=80&w=2070&auto=format&fit=crop', // tech working on server
    'https://images.unsplash.com/photo-1621924519390-78132692e293?q=80&w=2070&auto=format&fit=crop', // wiring patch panel
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop', // code on laptop
  ],
  companies: [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop', // modern office collaboration
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop', // professionals reviewing plans
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop', // conference room
  ],
};

// --- High-Fidelity Slideshow Mockups ---
export const SLIDESHOW_ASSETS = {
    slide1: 'https://i.imgur.com/Y38B9h1.png', // Engineer skill rating
    slide2: 'https://i.imgur.com/gK92uDR.png', // Company job posting
    slide3: 'https://i.imgur.com/uNf5P4I.png', // AI match results
    slide4: 'https://i.imgur.com/r122zW5.png', // Direct messaging
};

// --- User Avatars ---
export const AVATARS = {
    steve: 'https://i.imgur.com/L45aA6d.jpg',
    neil: 'https://xsgames.co/randomusers/assets/avatars/male/74.jpg',
    samantha: 'https://xsgames.co/randomusers/assets/avatars/female/10.jpg',
    david: 'https://xsgames.co/randomusers/assets/avatars/male/15.jpg',
    emily: 'https://xsgames.co/randomusers/assets/avatars/female/20.jpg',
    defaultCompany: 'https://i.pravatar.cc/150?u=default-company',
};

// --- New, Clean SVG Logos for Mock Companies ---

// FIX: Converted from JSX to React.createElement to be valid in a .ts file.
const ProAVLogo = ({ className }: { className?: string }) => (
  React.createElement('svg', { viewBox: "0 0 200 40", className: className, xmlns: "http://www.w3.org/2000/svg" },
    React.createElement('text', { x: "0", y: "30", fontFamily: "system-ui, sans-serif", fontSize: "30", fontWeight: "bold" },
      React.createElement('tspan', { fill: "#1e40af" }, "Pro"),
      React.createElement('tspan', { fill: "#3b82f6" }, "AV"),
      React.createElement('tspan', { fill: "#64748b" }, " Solutions")
    )
  )
);

const StarlightLogo = ({ className }: { className?: string }) => (
  React.createElement('svg', { viewBox: "0 0 200 40", className: className, xmlns: "http://www.w3.org/2000/svg" },
    React.createElement('defs', null,
      React.createElement('linearGradient', { id: "starlight-grad", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
        React.createElement('stop', { offset: "0%", style: { stopColor: '#f59e0b', stopOpacity: 1 } }),
        React.createElement('stop', { offset: "100%", style: { stopColor: '#f97316', stopOpacity: 1 } })
      )
    ),
    React.createElement('text', { x: "0", y: "30", fontFamily: "cursive, system-ui, sans-serif", fontSize: "30", fontWeight: "bold", fill: "url(#starlight-grad)" },
      "Starlight Events"
    )
  )
);

const NexusLogo = ({ className }: { className?: string }) => (
  React.createElement('svg', { viewBox: "0 0 220 40", className: className, xmlns: "http://www.w3.org/2000/svg" },
     React.createElement('text', { x: "0", y: "30", fontFamily: "monospace, system-ui, sans-serif", fontSize: "30", fontWeight: "bold" },
      React.createElement('tspan', { fill: "#166534" }, "<NexusIT />")
    )
  )
);

const AVPlacementsLogo = ({ className }: { className?: string }) => (
     React.createElement('svg', { viewBox: "0 0 240 40", className: className, xmlns: "http://www.w3.org/2000/svg" },
     React.createElement('text', { x: "0", y: "30", fontFamily: "system-ui, sans-serif", fontSize: "30", fontWeight: "bold" },
      React.createElement('tspan', { fill: "#111827" }, "AV"),
      React.createElement('tspan', { fill: "#be123c" }, " Placements")
    )
  )
);

export const COMPANY_LOGOS = {
  'comp-1': ProAVLogo,
  'comp-2': StarlightLogo,
  'comp-3': NexusLogo,
  'res-1': AVPlacementsLogo,
};
