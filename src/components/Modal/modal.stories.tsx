import { useState } from 'react';
import { Meta } from '@storybook/react';
import { Button, Modal } from 'antd';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Modal',
  component: Modal
} as Meta;



const Template = (args) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (e) => {
    setIsModalOpen(true);
    action('modal open')(e);
  };
  const handleOk = (e) => {
    setIsModalOpen(false);
    action('click in ok buttom')(e);
  };
  const handleCancel = (e) => {
    setIsModalOpen(false);
    action('click in cancel buttom')(e);
  };

  return (<>
    <Button type="primary" onClick={showModal}>
      Open Modal
    </Button>
    <Modal {...args} styles={{content:{padding:0}}} title={null} footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      You content
    </Modal>
    </>)

}

export const ModalMain = Template.bind({});
ModalMain.args = {
  closable: false
};
