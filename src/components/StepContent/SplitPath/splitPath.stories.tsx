import { useState } from 'react';
import { Meta } from '@storybook/react';
import { Button, Modal } from 'antd';
import { action } from '@storybook/addon-actions';
import StepModalHead from '@components/Modal/stepModalHead';
import Icon from '@/src/components/Icons';
import { IconList } from '@/src/components/Icons/types';
import { Divider } from 'antd';
import BaseCodeEditor from '@components/BaseCodeEditor';
import EditableTitle from '@/src/components/EditableTitle/editableTitle';


export default {
  title: 'Example/Step',
  component: Button,
} as Meta;

const Template = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [listBranch, setBranch] = useState([{
    id: 1,
    label: "Branch 1",
    isActiveInput: false
  },
  {
    id: 2,
    label: "Branch 2",
    isActiveInput: false
  }
  ]);

  const addBranch = (e) => {
    setBranch([...listBranch, {
      id: listBranch[listBranch.length - 1].id + 1, 
      label: "Branch " + (listBranch.length + 1),
      isActiveInput: false
    }]);
    action('add branch')(e);
  };

  const removeBranch = (branchId) => {
    const newListBranh = listBranch.filter((_, index) => index !== branchId);

    setBranch(newListBranh);
    action('remove branch')('newListBranh');
  };

  const handleActiveInput = (branchId) => {
    const newListBranh = [ ... listBranch]

    newListBranh[branchId].isActiveInput = true;

    setBranch(newListBranh);

    action('remove branch')('newListBranh');
  };  


  const onLabelChangeHead = (_newLabel: string) => {
    action('On label change')(_newLabel);
  }; 

  const onLabelChangeContent = (branchId) => {
    const newListBranh = [ ... listBranch]

    newListBranh[branchId].isActiveInput = false;

    setBranch(newListBranh);
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

  const handleKeyPress = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleActiveInput(index)
    }
  }

  return (<>
    <Button type="primary" onClick={showModal}>
      Open Modal
    </Button>
    <Modal width={640} title={null} footer={null} open={isModalOpen} onCancel={handleCancel}>
      <div className="head-split-path pt-2 pb-2 pl-4 pr-12">
        <StepModalHead onLabelChange={onLabelChangeHead} icon={IconList.Branch} label='Split path' />
      </div>
      <Divider style={{margin:0}}></Divider>
      <div className="content-split-path" style={{ overflow: "auto", maxHeight: "calc(100vh - 240px)"}}>
        {

          listBranch.map(function(branch, index) { 

            let styleConentClass = 'conent-code-input pl-4 pr-4 pb-2';

            styleConentClass +=  index == 0 ? " pt-4" : " pt-1"

            styleConentClass += branch.isActiveInput ? " bg-gray-50" : "";

            const classConentEditableText = [
              "pb-1",
              listBranch.length > 2 && "pr-0.9 mr-4"
            ]
            

            return (
            <div key={branch.id} className={styleConentClass}>
              <div className={classConentEditableText.join(' ')} >
                <EditableTitle onSpanClick={() => handleActiveInput(index)} $size='xs' strongText='semibold' label={branch.label} onLabelChange={() => onLabelChangeContent(index)} canEdit={true} />
              </div> 
              <div className="flex">
                <div role="button" onKeyDown={(event) => handleKeyPress(event, index)} tabIndex={0} onClick={ () => handleActiveInput(index) } className="flex-grow pr-1">
                  <BaseCodeEditor placeholder='var isValid = creditScore > 10' onBlur={() => onLabelChangeContent(index)} onChange={() => onLabelChangeContent(index)} defaultValue="" />
                </div>
                {
                  listBranch.length > 2 &&
                    <div className="flex items-center">
                      <Icon icon={IconList.Trash} hoverFill="#0A38C2" fill="#9CA3AF" cursor="pointer" width="16px" height="16px" onClick={() => removeBranch(index)} />
                    </div>
                }
              </div>
            </div>
            ) 
          })
        }
      </div>
      <div className="footer-split-path pl-4 pr-4 pt-4 pb-2 flex justify-between">
        <Button size='small' type="default" onClick={addBranch} >{"+ Branch"}</Button>

        <Button size='small' type="primary" onClick={stepSave} >{"Save"}</Button>
      </div>
    </Modal>
    </>)
};

export const StepContent = Template.bind({});
