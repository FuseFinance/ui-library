import { useState } from 'react';
import { Meta } from '@storybook/react';
import { Button, Modal } from 'antd';
import { action } from '@storybook/addon-actions';
import StepModalHead from '@components/Modal/stepModalHead';
import Icon from '@/src/components/Icons';
import { IconList } from '@/src/components/Icons/types';
import { Divider } from 'antd';
import CodeEditor from '@components/CodeEditor';
import EditableText from '@components/EditableText/editableText';


export default {
  title: 'Components/Step',
  component: Button,
} as Meta;

const Template = (args) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listBranch, setBranch] = useState([{
    id: 1,
    label: "Branch 1",
  }]);

  const addBranch = (e) => {
    setBranch([...listBranch, {
      id: listBranch.length + 1, 
      label: "Branch " + (listBranch.length + 1) 
    }]);
    action('add branch')(e);
  };

  const removeBranch = (branchId) => {
    var newListBranh = listBranch.filter((_, index) => index !== branchId);

    setBranch(newListBranh);
    action('remove branch')('newListBranh');
  };

  const onLabelChange = (e) => {
    action('On label change')(e);
  }; 

  const stepSave = (e) => {
    setIsModalOpen(false);
    action('click save')(e);
  };

  const showModal = (e) => {
    setIsModalOpen(true);
    action('modal open')(e);
  };

  const handleCancel = (e) => {
    setIsModalOpen(false);
    action('click in cancel buttom')(e);
  };

  return (<>
    <Button type="primary" onClick={showModal}>
      Open Modal
    </Button>
    <Modal title={null} footer={null} open={isModalOpen} onCancel={handleCancel}>
      <div className="head-split-path pl-4 pr-4 pt-2 pb-2">
        <StepModalHead onLabelChange={onLabelChange} icon={IconList.Fx} label='Split Path' />
      </div>
      <Divider style={{margin:0}}></Divider>
      <div className="content-split-path pl-4 pr-4 pt-2 pb-2 grid gap-y-4">
        {
          listBranch.map(function(branch, index) { 
            return (
            <div key={branch.id} className="conent-code-input">
              <div className="pb-2">
                <EditableText label={branch.label} onLabelChange={console.log} canEdit={true} />
              </div>
              <div className='flex'>
                <div className='flex-grow'>
                  <CodeEditor defaultValue="" onChange={console.log} />
                </div>
                <Icon icon={IconList.Trash} fill="#000" cursor="pointer" width="1.2rem" height="1.4rem" onClick={() => removeBranch(index)} />
              </div>
            </div>
            ) 
          })
        }
      </div>
      <div className="footer-split-path pl-4 pr-4 pt-2 pb-2 flex justify-between">
        <Button type="default" onClick={addBranch} >{"+ Branch"}</Button>

        <Button type="primary" onClick={stepSave} >{"Save"}</Button>
      </div>
    </Modal>
    </>)
};

export const StepContent = Template.bind({});
