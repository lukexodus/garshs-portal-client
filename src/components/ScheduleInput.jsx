import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Input from './Input';
import Button from './Button';
import Select from './Select';
import { useForm, processFormState } from './hooks/formHook'
import { useToast } from './contexts/ToastContext';

const weekdays = [['monday', 'Monday'], ['tuesday', 'Tuesday'], ['wednesday', 'Wednesday'], ['thursday', 'Thursday'], ['friday', 'Friday'], ['saturday', 'Saturday'], ['sunday', 'Sunday']];
const weekdayText = "Select Weekday";

const ScheduleInput = () => {
    const { setToast } = useToast()

    const [formState, inputHandler] = useForm({
        fromTime: { value: ''},
        weekday: { value: '' },
        toTime: { value: ''},
    })

    const submitSchedule = () => {
      if (
          !formState.inputs.fromTime.value ||
          !formState.inputs.toTime.value ||
          !formState.inputs.weekday.value ||
          formState.inputs.weekday.value === weekdayText
        ) {
          setToast({message: 'Please input both the "from" time and the "to" time and include the weekdays.', icon: 'cross'})
        return
      }

      console.log(formState.inputs);
      setToast(null);

      // axios.post('/api/v1/schedule', {schedule: processFormState(formState), section: state.class.section, subject: state.class.subject})
      //   .then(res => {
      //     setValidationMsg(res.data.msg);
      //   })
      //   .catch(error => {
      //       console.error(error);
      //   });
    }

    return (
    <>
        <div>
          <Select id="weekday" name="weekday" label={weekdayText} arrayOfData={weekdays} onSelect={inputHandler} />
          <Input element="input" type="time" id="fromTime" name="fromTime" label="From"
          required onInput={inputHandler}></Input>
          <Input element="input" type="time" id="toTime" name="toTime" label="To"
          required onInput={inputHandler}></Input>
          <Button type="button" variant="primary" size="small" onClick={submitSchedule} >
            Add Schedule
          </Button>
        </div>
    </>
    )
}

export default ScheduleInput
