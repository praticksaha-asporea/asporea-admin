import React from "react";
import Input from "../input/Input";
import form from "./formcus.module.scss";
import { styled } from "@mui/material/styles";
import RadioGroup, { useRadioGroup } from "@mui/material/RadioGroup";
import FormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

const FormCus = () => {
  interface StyledFormControlLabelProps extends FormControlLabelProps {
    checked: boolean;
  }

  const StyledFormControlLabel = styled(
    (props: StyledFormControlLabelProps) => <FormControlLabel {...props} />
  )(({ theme }) => ({
    variants: [
      {
        props: { checked: true },
        style: {
          ".MuiFormControlLabel-label": {
            color: theme.palette.primary.main,
          },
        },
      },
    ],
  }));

  function MyFormControlLabel(props: FormControlLabelProps) {
    const radioGroup = useRadioGroup();

    let checked = false;

    if (radioGroup) {
      checked = radioGroup.value === props.value;
    }

    return <StyledFormControlLabel checked={checked} {...props} />;
  }

  return (
    <div className={form.myprofilewrapper}>
      <div className='profile-card'>
        <h2>My Profile</h2>

        <form>
          <div className='profileform row'>
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <Input
                  type={"text"}
                  id='name'
                  placeholder={"Enter your Name"}
                  name='Full Name *'
                  title='Full Name *'
                  classes='inp'
                />
              </div>
            </div>
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <Input
                  type={"tel"}
                  id='name'
                  placeholder={"Enter phone number"}
                  name='Full Name *'
                  title='Phone Number *'
                />
              </div>
            </div>
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <Input
                  type={"email"}
                  id='name'
                  placeholder={"Enter email address"}
                  name='Full Name *'
                  title='Email Address *'
                />
              </div>
            </div>
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <Input
                  type={"text"}
                  id='name'
                  placeholder={"Enter email address"}
                  name='Full Name *'
                  title='Email Address *'
                />
              </div>
            </div>
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <Input
                  type={"date"}
                  id='name'
                  placeholder={"DD/MM/YYYY"}
                  name='Full Name *'
                  title='Date of Birth *'
                />
              </div>
            </div>
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <Input
                  type={"text"}
                  id='name'
                  placeholder={"Enter company name"}
                  name='Full Name *'
                  title='Company Name *'
                />
              </div>
            </div>
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <Input
                  type={"text"}
                  id='name'
                  placeholder={"Enter company name"}
                  name='Full Name *'
                  title='Company Name *'
                />
              </div>
            </div>
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <Input
                  type={"text"}
                  id='name'
                  placeholder={"Chose Service *"}
                  name='Full Name *'
                  title='Chose Service *'
                />
              </div>
            </div>
          </div>

          <RadioGroup
            name='use-radio-group'
            defaultValue='first'
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <p
              style={{
                color: "#282828",
                fontSize: "18px",
                paddingRight: "15px",
                fontWeight: "600",
              }}
            >
              Gender:
            </p>
            <FormControlLabel
              value='first'
              label='First'
              control={
                <Radio
                  sx={{
                    color: "#000",
                    "&.Mui-checked": {
                      color: "#FF0000",
                    },
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                />
              }
              sx={{
                color: "#000",
                "&.Mui-checked": {
                  color: "#000",
                },
              }}
            />
            <FormControlLabel
              value='second'
              label='Second'
              control={
                <Radio
                  sx={{
                    color: "#000",
                    "&.Mui-checked": {
                      color: "#FF0000",
                    },
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                />
              }
              sx={{
                color: "#000",
                "&.Mui-checked": {
                  color: "#000",
                },
              }}
            />
          </RadioGroup>

          <button disabled className={form.upbtn}>
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormCus;
