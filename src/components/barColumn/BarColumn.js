import style from "./bar-column.module.css";

const BarColumn = (props) => {
  return (
    <div className={style.column_wrapper} name={props.name}>
      <span className={style.column} style={{ width: `${props.width}%`, background: props.background }}></span>
      <span className={style.columnResult}>{props.result} $</span>
    </div>
  );
};

export default BarColumn;
