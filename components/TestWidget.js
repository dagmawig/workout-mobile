import React from 'react'
import { FlexWidget, ListWidget, TextWidget } from 'react-native-android-widget';
import { useSelector } from 'react-redux';

// const stateSelector = useSelector(state=>state.workout);
// const temp = stateSelector.userData.fixTempArr[0];

const fixTemp = {
  "tempID": "2023-01-19T23:46:30.547Z",
  "workoutTimeArr": [],
  "name": "Back and Biceps",
  "exerList": [
    {
      "bodyPart": "upper legs",
      "equipment": "barbell",
      "gifUrl": "http://d205bpvrqc9yn1.cloudfront.net/0032.gif",
      "id": "0032",
      "name": "barbell deadlift",
      "target": "glutes",
      "localUrl": "107.gif",
      "metric": "wr",
      "timeStamp": [],
      "sets": 3
    },
    {
      "bodyPart": "back",
      "equipment": "cable",
      "gifUrl": "http://d205bpvrqc9yn1.cloudfront.net/0861.gif",
      "id": "0861",
      "name": "cable seated row",
      "target": "upper back",
      "localUrl": "376.gif",
      "metric": "wr",
      "timeStamp": [],
      "sets": 3
    },
    {
      "bodyPart": "back",
      "equipment": "cable",
      "gifUrl": "http://d205bpvrqc9yn1.cloudfront.net/0150.gif",
      "id": "0150",
      "name": "cable bar lateral pulldown",
      "target": "lats",
      "localUrl": "272.gif",
      "metric": "wr",
      "timeStamp": [],
      "sets": 3
    },
    {
      "bodyPart": "upper arms",
      "equipment": "barbell",
      "gifUrl": "http://d205bpvrqc9yn1.cloudfront.net/0031.gif",
      "id": "0031",
      "name": "barbell curl",
      "target": "biceps",
      "localUrl": "106.gif",
      "metric": "wr",
      "timeStamp": [],
      "sets": 3
    }
  ]
};

const TestWidget = ({ template }) => {

  let temp = template ? template : fixTemp
  // returns time elapsed since last the time exercise template is used
  function calcTime(template) {
    let arr = template.workoutTimeArr;
    if (arr.length === 0) return 'Never';
    let lastTime = new Date(arr[arr.length - 1]).getTime();
    let hourDiff = Math.floor((new Date().getTime() - lastTime) / (1000 * 3600));
    return (hourDiff < 24) ? `${hourDiff} hour(s) ago` : `${Math.floor(hourDiff / 24)} day(s) ago`;
  }

  const tempName = `${temp.name}`;

  function TempName() {
    return (
      <TextWidget
        text={tempName.length<=36? tempName : `${tempName.slice(0,33)}...`}
        style={{
          fontSize: 20,
          fontFamily: 'Inter',
          color: '#FFFFFF',
        }}
      />
    )
  }

  const lastPerformed = `Last Performed: ${calcTime(temp)}`;


  function TempTime() {
    return (
      <TextWidget
        text={lastPerformed}
        style={{
          fontSize: 16,
          fontFamily: 'Inter',
          color: '#FFFFFF',
          marginBottom:5,
          fontStyle: 'italic'
        }}
      />
    )
  }

  function ExerList() {
    return (
      <ListWidget
        style={{
          height: 150,
          width: 380,
          overflow: 'auto',
          borderColor: '#FFFFFF',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 10,
          padding: 5
        }}>
        {
          temp.exerList.map((exer, i) => {
            return (
              <FlexWidget
                key={i}
                style={{
                  height: 40,
                  width: 370,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <TextWidget
                  text={`${exer.sets} X ${exer.name.length<=36? exer.name : `${exer.name.slice(0,33)}...`}`}
                  style={{
                    fontSize: 16,
                    fontFamily: 'Inter',
                    color: '#FFFFFF',
                    borderRadius: 10,
                    backgroundColor: '#1a364f',
                    padding: 8,
                  }}
                />
              </FlexWidget>

            )
          })
        }
      </ListWidget>
    )
  }
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#28547B',
        borderRadius: 16,
      }}
    >
      <TempName />
      <TempTime />
      <ExerList />
    </FlexWidget>
  )
}

export default TestWidget