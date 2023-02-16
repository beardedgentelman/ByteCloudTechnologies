import { Scale } from "../../components";
import style from "./form.module.css";

const Form = (props) => {
  return (
    <form name={props.formName} className={style.form}>
      <Scale labelName='Storage' type='range' min={0} max={1000} step={1} value={props.storage} onChange={props.onChangeStorage}>
        {props.storage} GB
      </Scale>
      <Scale labelName='Transfer' type='range' min={0} max={1000} step={1} value={props.transfer} onChange={props.onChangeTransfer}>
        {props.transfer} GB
      </Scale>
    </form>
  );
};

export default Form;
