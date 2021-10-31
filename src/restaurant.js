import React, { useEffect, useState } from 'react';
import { Rectangle, Circle, Ellipse, Polyline,  Triangle } from 'react-shapes';
import './restaurant.css'

import tables from './floor.json';
import orders from './orders.json';



export default function Restaurant(props) {

    const [arrayTable, setArrayTable] = useState(tables)
    let arrayOrders = orders

    let min = 9
    let mone = 0
    let tableCatch = []
    let queue = []
    let flag = false;

    useEffect(() => {
        let e = arrayTable.map(element => {
            element.flag = 0;
            element.order = {}
            return element
        });
        setArrayTable(e)
        ifFreeSpace();
    }, []);

    const ifFreeSpace = () => {
        arrayOrders.map((order) => {
            flag = false
            min = 9
            mone = 0
            tableCatch = []
            for (let i = 0; i < arrayTable.length && flag === false; i++) {
                let table = arrayTable[i]
                table.index=i;
                if (table.flag === 0) {
                    if (flag === false && table.Diners === order.Diners) {
                        flag = true
                        table.order = order
                        tableCatch.push(table)
                    }
                    else {
                        if (table.Diners < order.Diners) {
                            for (let index = 0; index < table.Concat.length && mone >= order.Diners; index++) {
                                let concat = table.Concat[index]
                                const concatTable = arrayTable.find(table1 => table1.Table === concat);
                                mone += concatTable.Diners
                                if (mone >= order.Diners && mone < min)
                                    min = table.Diners + mone
                                tableCatch.push(table)
                                tableCatch.push(concatTable)

                            }
                        }
                        else {
                            if (table.Diners >= order.Diners && table.Diners < min) {
                                min = table.Diners
                                tableCatch = []
                                tableCatch.push(table)
                            }
                        }
                    }
                }
            }
            if (!tableCatch.length) {
                queue.push(order)
            }
            else {
                tableCatch.map((table) => {
                    table.order = order
                    afterCheckTable(table)
                })
            }
            arrayOrders= arrayOrders.filter(function(o) { 
                return o !== order
            });
        })
    }
    const afterCheckTable = (table) => {
        let statrTime = new Date()
        let time = statrTime.getHours() + ':' + statrTime.getMinutes() + ':' + statrTime.getSeconds();
        let arr= arrayTable;
        arr[table.index].flag=1
        arr[table.index].order.StatrTime=time
        setArrayTable([...arr]);
  
        setTimeout(() => {
            arr[table.index].flag=2
            setArrayTable([...arr]);

        }, 3000)
        setTimeout(() => {
            let endrTime = new Date()
            let time2 = endrTime.getHours() + ':' + endrTime.getMinutes() + ':' + endrTime.getSeconds();
            arr[table.index].flag=0
            arr[table.index].order.EndrTime=time2
            setArrayTable([...arr]);
            table.order = {}
            // sentToCompletedOrders(table)
            if(queue.length){
                arrayOrders=[...arrayOrders,...queue]
                queue=[]
                ifFreeSpace()
            }
        }, 6000)

    }
    const clickAble = (order) => {
        alert("Mobile:" + " "+order.Mobile+"\n"+
        "Diners:" + " " +order.Diners+"\n"+
        "StartTime:" + " "+ order.StatrTime)
    }
    // const sentToCompletedOrders =(table)=>{
        //לשלוח לקובץ json 
    // }


    return (

        <div className="container">
                {arrayTable.map(object => {
                    return (
                        object.Diners === 1 ? <Circle key={object.Table}  onClick={() => object.flag !== 0 ? clickAble(object.order) : ""} r={70} fill={{ color: object.flag === 1 ? "red" : object.flag === 2 ? "orange" : '#2409ba' }} stroke={{ color: 'black' }} strokeWidth={3} /> :
                            object.Diners === 2 ? <Ellipse key={object.Table}  onClick={() => object.flag !== 0 ? clickAble(object.order) : ""} rx={100} ry={40} fill={{ color: object.flag === 1 ? "red" : object.flag === 2 ? "orange" : '#2409ba' }} stroke={{ color: 'black' }} strokeWidth={3} /> :
                                object.Diners === 3 ? <Triangle key={object.Table} onClick={() => object.flag !== 0 ? clickAble(object.order) : ""} width={100} height={100} fill={{ color: object.flag === 1 ? "red" : object.flag === 2 ? "orange" : '#2409ba' }} stroke={{ color: 'black' }} strokeWidth={3} /> :
                                    object.Diners === 4 ? <Rectangle key={object.Table}  onClick={() => object.flag !== 0 ? clickAble(object.order) : ""} width={100} height={100} fill={{ color: object.flag === 1 ? "red" : object.flag === 2 ? "orange" : '#2409ba' }} stroke={{ color: 'black' }} strokeWidth={3} /> :
                                        object.Diners === 5 ? <Polyline key={object.Table} onClick={() => object.flag !== 0 ? clickAble(object.order) : ""} points='250,250 100,150 200,50 300,50 400,150 250,250' fill={{ color: object.flag === 1 ? "red" : object.flag === 2 ? "orange" : '#2409ba' }} stroke={{ color: 'black' }} strokeWidth={3} /> :
                                            <Polyline key={object.Table} r={50} onClick={() => object.flag !== 0 ? clickAble(object.order) : ""} points='250,250, 100,150 200,50 300,50 400,150 250,250' fill={{ color: object.flag === 1 ? "red" : object.flag === 2 ? "orange" : '#2409ba' }} stroke={{ color: 'black' }} strokeWidth={3} />
                    )
                })}
        </div>
    );

}