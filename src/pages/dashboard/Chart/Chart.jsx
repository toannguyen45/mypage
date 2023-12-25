import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const ChartPie = ({ data }) => {
  const chartRef = useRef(null)

  const transformedData = data.map(item => ({
    value: item.count,
    name: item.name,
  }))

  useEffect(() => {
    const myChart = echarts.init(chartRef.current)

    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '1%',
        left: 'center',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: transformedData,
        },
      ],
    }

    myChart.setOption(option)

    return () => {
      myChart.dispose()
    }
  }, [transformedData])

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
}

const ChartBar = () => {
  const chartRef = useRef(null)

  useEffect(() => {
    const myChart = echarts.init(chartRef.current)

    const option = {
      xAxis: {
        type: 'category',
        data: [
          'Jan-Feb',
          'Mar-Apr',
          'May-Jun',
          'July-Aug',
          'Sep-Oct',
          'Nov-Dec',
        ],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [10, 7, 19, 12, 29, 25],
          type: 'bar',
        },
      ],
    }

    myChart.setOption(option)

    return () => {
      myChart.dispose()
    }
  }, [])

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
}

export { ChartPie, ChartBar }
