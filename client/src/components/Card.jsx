const Card = ({ children, className = '', size = 'default' }) => {
  const cardClass = `card ${size === 'small' ? 'card-small' : 'card-content'} ${className}`.trim();
  
  return (
    <div className={cardClass}>
      {children}
    </div>
  );
};

export default Card;
