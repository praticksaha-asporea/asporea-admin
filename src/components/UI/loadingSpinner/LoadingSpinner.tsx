import classes from "./LoadingSpinner.module.scss";

const LoadingSpinner = () => {
  return (
    <div className={`${classes.spinner__wrapper} spinner__wrapper`}>
      <div className={`${classes.spinner} spinner__element`}></div>
    </div>
  );
};

export default LoadingSpinner;