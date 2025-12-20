
const LetterModal = () => {
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");




  return (
    <div className="letter-modal-backdrop">
      <div className="letter-modal">
        {LETTERS.map((l) => (
          // <button key={l} onClick={() => onSelect(l)}>
          <button key={l} >

            {l}
          </button>
        ))}
        {/* <button className="close" onClick={onClose}>✕</button> */}
                <button className="close" >✕</button>
      </div>
    </div>
  );
};

export default LetterModal;
