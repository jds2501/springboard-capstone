const Card = ({ children, className = '', size = 'default', ...props }) => {
  const cardClass = `card ${size === 'small' ? 'card-small' : 'card-content'} ${className}`.trim();
  
  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};

export default Card;
