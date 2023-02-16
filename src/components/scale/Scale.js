import style from "./scale.module.css";

const Scale = (props) => {
  const getBackgroundSize = () => {
    return {
      backgroundSize: `${(props.value * 100) / props.max}% 100%`,
    };
  };

  return (
    <div className={style.form__item}>
      <label className={style.label}>
        {props.labelName}
        <div className={style.value_container}>{props.children}</div>
      </label>
      <div className={style.form_bar}>
        <input className={style.input} style={getBackgroundSize()} type={props.type} min={props.min} max={props.max} step={props.step} value={props.value} onChange={props.onChange} />
      </div>
    </div>
  );
};

export default Scale;
