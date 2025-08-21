// This is a simplified "server-side" renderer for React elements to string.
// It's a hack to continue using lucide-react without a full React runtime.
// In a real application, you'd use a Lit-native icon library or raw SVGs.
export const renderReactIcon = (el) => {
    if (!el) return '';

    // Handle text nodes
    if (typeof el !== 'object') {
        return el;
    }
    
    // Handle functional components by executing them
    if (typeof el.type === 'function') {
        return renderReactIcon(el.type(el.props));
    }

    if (!el.type) return '';

    const type = el.type;
    const props = el.props || {};
    
    const attrs = Object.entries(props)
        .filter(([key]) => key !== 'children')
        .map(([key, value]) => {
            // Convert camelCase to kebab-case and handle special cases like className
            let attrKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
            if (attrKey === 'classname') attrKey = 'class';
            if (attrKey === 'strokewidth') attrKey = 'stroke-width';
            if (attrKey === 'strokelinecap') attrKey = 'stroke-linecap';
            if (attrKey === 'strokelinejoin') attrKey = 'stroke-linejoin';
            return `${attrKey}="${value}"`;
        })
        .join(' ');

    const children = props.children 
        ? (Array.isArray(props.children) 
            ? props.children.map(child => renderReactIcon(child)).join('')
            : renderReactIcon(props.children))
        : '';

    // Handle self-closing SVG tags
    const selfClosingTags = ['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'image'];
    if (selfClosingTags.includes(type)) {
        return `<${type} ${attrs} />`;
    }
    
    return `<${type} ${attrs}>${children}</${type}>`;
};