import { View, Text, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import sampleData from '../assets/ExerData/sampleExerData.json';
import { useSelector } from "react-redux";
import { useState } from "react";



function LineChartComp({ exer }) {

    const stateSelector = useSelector(state => state.workout);

    const record = stateSelector.userData.record;
    let dim = Dimensions.get("window").width;
    let length = exer.name in record? record[exer.name].session.length*20< dim? dim-30 : record[exer.name].session.length*20 : sampleData.length * 20;

    const [sample, setSample] = useState(false);

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

    let chartArr = exer.name in record ? record[exer.name].session : sampleData

    let data = {
        labels: chartArr.map((sessionObj, i) => {
            let date = new Date(sessionObj.date)
            return i % 5 === 0 ? `${date.toLocaleDateString('en-US', { month: 'numeric' })}/${date.toLocaleDateString('en-US', { day: 'numeric' })}` : '';
        }),
        datasets: [
            {
                data: chartArr.map(sessionObj => sessionObj.best1),
                strokeWidth: 1.5
            }
        ]
    };

    function chartComp() {
        return <LineChart
            data={data}
            width={ length} // from react-native
            height={300}
            yAxisLabel=""
            withShadow={false}
            yAxisSuffix=""
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
                paddingHorizontal:0,
                borderRadius: 16,
                paddingTop: 15,
                paddingBottom: 0,
            }}
            renderDotContent={dotContent}
        />
    }

    return (
        <View className='flex items-center mt-6'>
            <View className='flex'>
                <Text className='text-white text-lg text-left bg-[#326592] px-1 mb-1'>Workout Record Chart</Text>
            </View>
            {exer.name in record ?
                <>
                    <View className='flex items-center'>
                        <Text className='text-white'>{`Session Record for ${exer.name}`}</Text>
                    </View>
                    <ScrollView horizontal>
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
                            <ScrollView horizontal className='mt-0 pt-0'>
                                <View className='w-full px-0 flex items-center'>
                                    {chartComp()}
                                </View>
                            </ScrollView>
                        </> :
                            <>
                                <View className='flex items-center space-y-2'>
                                    <Text className='text-gray-400'>{`No workout record for this exercise..`}</Text>
                                    <TouchableOpacity onPress={()=>setSample(true)}><Text className='text-white'>Load sample chart</Text></TouchableOpacity>
                                </View>
                            </>

                    }
                </>}
        </View>
    );
}


export default LineChartComp;