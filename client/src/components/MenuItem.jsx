export const MenuItem = ({ object }) => {
  return (
    <p>
      <div style={{display:"flex", fontSize: "1.05rem", gap:5, alignItems:"center"}}>
        <div>{object.icon}</div>
        <div>{object.word}</div>
      </div>
    </p>
  );
};
