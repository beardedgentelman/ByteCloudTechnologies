import style from "./provider-info.module.css";

const ProviderInfo = (props) => {
  return (
    <div className={style.provider_info__container}>
      <img src={props.provIcon} alt={props.name} />
      <h3>{props.name}</h3>
      {props.children}
    </div>
  );
};

export default ProviderInfo;
