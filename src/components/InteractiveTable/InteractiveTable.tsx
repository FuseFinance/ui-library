import { forwardRef, ForwardedRef } from 'react';

import { TypeInputTableSimple } from './type';
import InteractiveTableControlled from './InteractiveTableControlled';
import InteractiveTableUncontrolled from './InteractiveTableUncontrolled';

const InteractiveTable = forwardRef(
  (props: TypeInputTableSimple, ref: ForwardedRef<HTMLDivElement>) => {
    const { value } = props;
    if (value != undefined) {
      return <InteractiveTableUncontrolled ref={ref} {...props} />;
    }
    return <InteractiveTableControlled ref={ref} {...props} />;
  },
);

InteractiveTable.displayName = 'InteractiveTable';

export default InteractiveTable;

/* <InteractiveTable cellToAdd={{render, id, id, data}} /> */

// const data = [
//   { name: 'name1', age: '1', uuui1: ''}, Row
//   { name: 'name2', age: '1', uuui1: ''},
//   { name: 'name3', age: '1', uuui1: '', disabled},
// ]

// columns = [
//   {
//     label: 'name',
//     render: (props: R, context) => { props.name}
//   },
//   {
//     label: 'age',
//     render: (props: R, context) => { props.age}
//   },
// ]

// // add rows
// const data = [
//   { name: '', age: '',  },
//   { name: 'name1', age: '1' },
//   { name: 'name2', age: '1' },
//   { name: 'name3', age: '1' },
//   { name: '', age: '' },
//   { name: '', age: '' },
// ]

// // add cols

// const data = [
//   { name: 'name1', age: '1' meta: { uuid: ''}},
//   { name: 'name2', age: '1' meta: { uuid: ''}},
//   { name: 'name3', age: '1' meta: { uuid: ''}},
// ]

// // shallow
// columns2 = [...columns]
// [
//   {
//     label: 'name',
//     render: (props: R, context) => { props.name}
//   },
//   {
//     label: 'age',
//     render: (props: R, context) => { props.age}
//   },
//   {
//     objectKey:uui
//     label: '',
//     render: (props: R, context) => { return props[uui]}
//   },
// ]

// <InteractiveTable
//   value={data}
//   onChnage
//   xxxxxxxxxxxxx={() => {}}
//   oRemove
//   onAdd
//   onAddRow
//   onAddColumn
//   onRemoveRow
//   onRemoveColumn
//   colums={columns}
//   edit
// />
