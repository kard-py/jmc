const Card = (props) => {
  return (
    <div
      {...props}
      className={`flex bg-white shadow-2xl rounded-xl p-5 m-3 ${props.className}`}
    >
      {props.children}
    </div>
  );
};

export default Card;
