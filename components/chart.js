import { View, Text, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import sampleData from '../assets/ExerData/sampleExerData.json';
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";

function LineChartComp({ exer }) {

    const stateSelector = useSelector(state => state.workout);
    const scrollViewRef = useRef();

    const record = stateSelector.userData.record;
    let dim = Dimensions.get("window").width;

    // Gets min and max date of a the date picker using the current workout record
    function getDates() {
        if (exer.name in record && record[exer.name].session) {
            let sessionArr = record[exer.name].session;
            let minDate = new Date(sessionArr[0].date)
            let maxDate = new Date(sessionArr[sessionArr.length - 1].date);
            return {
                min: minDate,
                max: maxDate
            }
        }
        else {
            let minDate = new Date(sampleData[0].date)
            let maxDate = new Date(sampleData[sampleData.length - 1].date);
            return {
                min: minDate,
                max: maxDate
            }
        }
    }

    // Defines initial workout record range and chart length
    let chartArr = exer.name in record && record[exer.name].session ? record[exer.name].session : sampleData.slice(-40);
    let length = chartArr.length * 20 < dim ? dim - 30 : chartArr.length * 20;

    const [sample, setSample] = useState(false);
    const [show, setShow] = useState(false);
    const [startDate, setStartDate] = useState(new Date(chartArr[0].date));
    const [endDate, setEndDate] = useState(new Date(chartArr[chartArr.length - 1].date));
    const [dateType, setDateType] = useState(null);
    const [maxDate, setMaxDate] = useState(getDates().max);
    const [minDate, setMinDate] = useState(getDates().min);
    const [cArr, setCarr] = useState(chartArr);
    const [len, setLen] = useState(length);
    const [labelDist, setLabelDist] = useState(Math.floor(len / (6 * cArr.length)) < 5 ? Math.floor(len / (6 * cArr.length)) : 5);

    // displays calendar to used to pick start date
    function pickStart() {
        setShow(true);
        setDateType('start');
        setMaxDate(endDate ? endDate : getDates().max);
        setMinDate(getDates().min);
    }

    // displays calendar used to pick end date
    function pickEnd() {
        setShow(true);
        setDateType('end');
        setMaxDate(getDates().max);
        setMinDate(startDate ? startDate : getDates().min);
    }

    // resets date range for workout record chart
    function resetDates() {
        let newChartArr = exer.name in record && record[exer.name].session ? record[exer.name].session.slice(-40) : sampleData.slice(-40);
        let newLen = chartArr.length * 20 < dim ? dim - 30 : chartArr.length * 20;
        setCarr(newChartArr);
        setLen(newLen);
        setStartDate(new Date(chartArr[0].date));
        setEndDate(new Date(chartArr[chartArr.length - 1].date));
        setLabelDist(Math.floor(newLen / (6 * newChartArr.length)) < 5 ? Math.floor(newLen / (6 * newChartArr.length)) : 5)
    }

    // updates chart with given start and end date
    function updateChartArr(startDate, endDate) {
        let sessionArr = exer.name in record && record[exer.name].session ? record[exer.name].session : sampleData;
        let setStartDate = new Date(startDate);
        let setEndDate = new Date(endDate);
        let newChartArr = sessionArr.filter(session => {
            let sessionDate = new Date(session.date);
            setStartDate.setUTCHours(0, 0, 0, 0);
            setEndDate.setUTCHours(0, 0, 0, 0);
            sessionDate.setUTCHours(0, 0, 0, 0);
            return sessionDate.toISOString() >= setStartDate.toISOString() && sessionDate.toISOString() <= setEndDate.toISOString();
        })
        let newLen = newChartArr.length * 20 < dim ? dim - 30 : newChartArr.length * 20;
        setCarr(newChartArr);
        setLen(newLen);
        setLabelDist(Math.floor(newLen / (6 * newChartArr.length)) < 5 ? Math.floor(newLen / (6 * newChartArr.length)) : 5)
    }

    // handles date selection
    function updateDate(event, date) {
        setShow(false);
        if (event.type === 'set') {

            if (dateType === 'start') {
                setStartDate(new Date(date));
                updateChartArr(new Date(date), endDate)
            }
            else {
                setEndDate(new Date(date));
                updateChartArr(startDate, new Date(date));
            }
        }
    }

    // displays y values of data points on the workout record chart
    function dotContent({ x, y, indexData }) {
        return (
            <View
                key={`${x}+${y}`}
                style={{
                    position: 'absolute',
                    top: y - 15,
                    left: x - 8,
                }}>
                <Text style={{ fontSize: 10, color: 'white' }}>
                    {indexData}
                </Text>
            </View>

        )
    }

    // defines the data to be used for the workout record chart
    let data = {
        labels: cArr.map((sessionObj, i) => {
            let date = new Date(sessionObj.date)
            if (chartArr.length < 10) return `${date.toLocaleDateString('en-US', { month: 'numeric' })}/${date.toLocaleDateString('en-US', { day: 'numeric' })}/${date.toLocaleDateString('en-US', { year: 'numeric' }).substring(2)}`;
            else return i % labelDist === 0 ? `${date.toLocaleDateString('en-US', { month: 'numeric' })}/${date.toLocaleDateString('en-US', { day: 'numeric' })}/${date.toLocaleDateString('en-US', { year: 'numeric' }).substring(2)}` : '';
        }),
        datasets: [
            {
                data: cArr.map(sessionObj => {
                    if (exer.name in record && record[exer.name].session) {
                        if (record[exer.name].pr1 === 0 && exer.metric === 'wr') return parseFloat(sessionObj.record2[sessionObj.index2]);
                        else return parseFloat(sessionObj.record1[sessionObj.index1]);
                    }
                    else return sessionObj.best1

                }),
                strokeWidth: 1.5
            }
        ]
    };

    // defines the line workout record line chart  component
    function chartComp() {
        return <LineChart
            data={data}
            width={len} // from react-native
            height={300}
            yAxisLabel=""
            withShadow={false}
            withVerticalLines={true}
            yAxisSuffix=""
            withHorizontalLabels={false}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
                backgroundColor: "#28547B",
                backgroundGradientFrom: "#326592",
                backgroundGradientTo: "#326592",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
                propsForDots: {
                    r: "3",
                    strokeWidth: "2",
                    stroke: "#750000"
                }
            }}
            style={{
                marginVertical: 0,
                paddingHorizontal: 0,
                borderRadius: 16,
                paddingTop: 20,
                paddingBottom: 0,
                paddingRight: 40,
                marginRight: -20
            }}
            renderDotContent={dotContent}
        />
    }

    // defines the date range component
    function dateRangeComp() {
        return (
            <View className='flex justify-around items-center pt-0 space-x-2'>
                <View className='flex-row w-full justify-between'>
                    <TouchableOpacity onPress={pickStart} className='w-1/3'><Text className='text-white text-lg text-center'>pick start date</Text></TouchableOpacity>
                    <TouchableOpacity onPress={resetDates} className='w-1/3'><Text className='text-white text-lg text-center'>reset dates</Text></TouchableOpacity>
                    <TouchableOpacity onPress={pickEnd} className='w-1/3'><Text className='text-white text-lg text-center'>pick end date</Text></TouchableOpacity>
                </View>

                <View className='flex-row w-full justify-between'>
                    <Text className='w-1/3 text-white text-center'>{`${startDate ? startDate.toLocaleDateString('en-US', { month: 'numeric' }) + '/' + startDate.toLocaleDateString('en-US', { day: 'numeric' }) + '/' + startDate.toLocaleDateString('en-US', { year: 'numeric' }).substring(2) : 'mm/dd/yy'}`}</Text>
                    <Text className='w-1/3 text-white text-center'>&lt;--------&gt;</Text>
                    <Text className='w-1/3 text-white text-center'>{`${endDate ? endDate.toLocaleDateString('en-US', { month: 'numeric' }) + '/' + endDate.toLocaleDateString('en-US', { day: 'numeric' }) + '/' + endDate.toLocaleDateString('en-US', { year: 'numeric' }).substring(2) : 'mm/dd/yy'}`}</Text>
                </View>
                <>
                    {show && <RNDateTimePicker mode="date" value={maxDate} onChange={updateDate} maximumDate={maxDate} minimumDate={minDate} />}
                </>
            </View>
        )
    }

    return (
        <View className='flex items-center mt-6'>
            <View className='flex'>
                <Text className='text-white text-lg text-left bg-[#326592] px-1 mb-1 font-semibold'>Workout Record Chart</Text>
            </View>
            {exer.name in record && record[exer.name].session ?
                <>
                    <View className='flex items-center'>
                        <Text className='text-white bg-[#326592]'>{`Session Record for ${exer.name} in ${(exer.metric === 'wr' && record[exer.name].pr1 === 0) ? 'REPS' : exer.metric === 'wr' ? 'LBS' : exer.metric === 'dt' ? 'MILES' : 'SECONDS'}`}</Text>
                    </View>
                    {dateRangeComp()}
                    <ScrollView horizontal ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
                        <View className='w-full px-0 flex items-center'>
                            {chartComp()}
                        </View>
                    </ScrollView>
                </> :
                <>
                    {
                        sample ? <>
                            <View className='flex items-center mb-0 pb-0'>
                                <Text className='text-white bg-[#326592] px-1'>{`Sample Weight (LBS) Record for barbell bench press`}</Text>
                            </View>
                            {dateRangeComp()}
                            <ScrollView horizontal className='mt-0 pt-0' ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
                                <View className='w-full px-0 flex items-center'>

                                    {chartComp()}
                                </View>
                            </ScrollView>

                        </> :
                            <>
                                <View className='flex items-center space-y-2'>
                                    <Text className='text-gray-400'>{`No workout record for this exercise..`}</Text>
                                    <TouchableOpacity onPress={() => setSample(true)}><Text className='text-white text-lg italic'>Load sample chart</Text></TouchableOpacity>
                                </View>
                            </>
                    }
                </>}
        </View>
    );
}

export default LineChartComp;