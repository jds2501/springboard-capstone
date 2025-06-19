import './Icon.css';

const Icon = ({ 
  type, 
  size = 'medium', 
  color = 'default',
  className = '',
  ...props 
}) => {
  const iconClass = `icon icon--${size} icon--${color} ${className}`.trim();

  const icons = {
    star: (
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    ),
    error: (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    ),
    check: (
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    ),
    warning: (
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    )
  };

  return (
    <svg 
      className={iconClass}
      viewBox="0 0 24 24" 
      fill="currentColor"
      {...props}
    >
      {icons[type] || icons.star}
    </svg>
  );
};

export default Icon;
