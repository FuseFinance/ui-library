import { useState, useEffect } from 'react';
import { Meta } from '@storybook/react';
import { Divider, Button, Modal, Select, Space, Input, Switch } from 'antd';
import { action } from '@storybook/addon-actions';
import StepModalHead from '@components/Modal/stepModalHead';
import { IconList } from '@/src/components/Icons/types';
import { BaseCodeEditor } from '@components/BaseCodeEditor';
import { InteractiveTable } from '@components/InteractiveTable';
import { CodeEditorTextArea } from '@components/CodeEditorTextArea';
import { javascript } from '@codemirror/lang-javascript';

export default {
  title: 'Example/Step',
  component: Button,
} as Meta;

const Template = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFocusZone, setActiveFocusZone] = useState('');
  const [method, setMethod] = useState('GET');
  const [certFieldVisible, setCertFieldVisible] = useState<boolean>(false);
  const [bodyAllows, setBodyAllows] = useState<boolean>();

  // Label
  const onLabelChange = (e) => {
    action('On label change')(e);
  };

  // Method
  const onChangeMethod = (e) => {
    setMethod(e);
  };

  const onFocusMethod = () => {
    setActiveFocusZone('url-zone');
  };

  const onBlurMethod = () => {
    setActiveFocusZone('');
  };

  // Url
  const onFocusUrl = () => {
    setActiveFocusZone('url-zone');
  };

  const onBlurUrl = () => {
    setActiveFocusZone('');
  };

  // Headers
  const onFocusHeaders = () => {
    setActiveFocusZone('headers-zone');
  };

  const onBlurHeaders = () => {
    setActiveFocusZone('');
  };

  // Body
  const onFocusBody = () => {
    setActiveFocusZone('body-zone');
  };

  const onBlurBody = () => {
    setActiveFocusZone('');
  };

  // Certificate file
  const onFocusCertificateFile = () => {
    setActiveFocusZone('certificate-file-zone');
  };

  const onBlurCertificateFile = () => {
    setActiveFocusZone('');
  };

  // Key file
  const onFocusKeyFile = () => {
    setActiveFocusZone('key-file-zone');
  };

  const onBlurKeyFile = () => {
    setActiveFocusZone('');
  };

  // Output Variable
  const onFocusOutputVariable = () => {
    setActiveFocusZone('output-variable-zone');
  };

  const onBlurOutputVariable = () => {
    setActiveFocusZone('');
  };

  /* */
  const stepTest = (e) => {
    action('click test')(e);
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
    action('click in cancel button')(e);
  };

  const addCertificate = (e) => {
    setCertFieldVisible(!certFieldVisible);
    action('add certificate fields')(e);
  };

  useEffect(() => {
    if (method === 'GET') {
      setBodyAllows(false);
    } else if (method === 'POST') {
      setBodyAllows(true);
    } else if (method === 'PATCH') {
      setBodyAllows(true);
    } else if (method === 'PUT') {
      setBodyAllows(true);
    } else if (method === 'DELETE') {
      setBodyAllows(false);
    }
  }, [method]);

  const renderBaseCodeEditor = (data) => {
    return (
      <BaseCodeEditor
        onBlur={onBlurHeaders}
        onFocus={onFocusHeaders}
        defaultValue={data.defaultValue}
        customCSSClass=""
        placeholder={data.placeholder}
        maxLines={1}
        plugins={[
          {
            name: 'interpolations',
            isModule: true,
            decorationClass: 'code-tag code-editor-hl-interpolations',
            options: {},
            matchRegex: /\{\{\s*([^}}]*?)\s*\}\}/g,
          },
        ]}
      />
    );
  };

  const initCellData = [
    [
      {
        columnId: 1,
        rowId: 1,
        defaultValue: '',
        placeholder: 'key',
        type: 'input-cell',
        removeDataInAggregation: {
          defaultValue: '',
        },
        render: renderBaseCodeEditor,
      },
      {
        columnId: 2,
        rowId: 1,
        defaultValue: '',
        placeholder: 'value',
        type: 'input-cell',
        removeDataInAggregation: {
          defaultValue: '',
        },
        render: renderBaseCodeEditor,
      },
    ],
  ];

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        className="modal-global-sistem"
        styles={{ content: { padding: 0 } }}
        width={640}
        title={null}
        footer={null}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <div style={{ height: 40 }} className="flex items-center head-split-path pl-4 pr-12">
          <StepModalHead onLabelChange={onLabelChange} icon={IconList.Plug} label="API call" />
        </div>
        <Divider style={{ margin: 0 }}></Divider>
        <div style={{ overflow: 'auto' }} className="scroll-modal content-split-path">
          <div className="flex flex-col">
            <div
              className={`hover:bg-gray-50 pl-4 pr-4 pt-4 pb-2 ${activeFocusZone === 'url-zone' && 'bg-gray-50'}`}
            >
              <Space.Compact className="w-full">
                <Select
                  defaultValue={method}
                  onChange={onChangeMethod}
                  onFocus={onFocusMethod}
                  onBlur={onBlurMethod}
                  options={[
                    { value: 'GET', label: 'GET' },
                    { value: 'POST', label: 'POST' },
                    { value: 'PATCH', label: 'PATCH' },
                    { value: 'PUT', label: 'PUT' },
                    { value: 'DELETE', label: 'DELETE' },
                  ]}
                  popupMatchSelectWidth={false}
                />
                <BaseCodeEditor
                  onFocus={onFocusUrl}
                  onBlur={onBlurUrl}
                  containerCSSClass="w-full"
                  defaultValue=""
                  placeholder="URL"
                  maxLines={1}
                  plugins={[
                    {
                      name: 'interpolations',
                      isModule: true,
                      decorationClass: 'code-tag code-editor-hl-interpolations',
                      options: {},
                      matchRegex: /\{\{\s*([^}}]*?)\s*\}\}/g,
                    },
                  ]}
                />
              </Space.Compact>
            </div>

            <div
              className={`hover:bg-gray-50 pt-2 pb-2 pl-4 pr-4 ${activeFocusZone === 'headers-zone' && 'bg-gray-50'}`}
            >
              <div className="flex w-full">
                <div className="w-full">
                  <p className="font-normal text-xs pb-1">Headers</p>
                </div>
              </div>
              <InteractiveTable canAddRows={true} defaultValue={initCellData}></InteractiveTable>
            </div>

            {bodyAllows && (
              <div
                className={`hover:bg-gray-50 pt-2 pb-2 pl-4 pr-4 ${activeFocusZone === 'body-zone' && 'bg-gray-50'}`}
              >
                <p className="font-normal text-xs pb-1">Body</p>
                <Select
                  onBlur={onBlurBody}
                  onFocus={onFocusBody}
                  className="w-full mb-1"
                  defaultValue={'JSON'}
                  options={[
                    { value: 'JSON', label: 'JSON' },
                    { value: 'XML', label: 'XML' },
                    { value: 'X_WWW_FORM_URLENCODED', label: 'X_WWW_FORM_URLENCODED' },
                  ]}
                />
                <CodeEditorTextArea
                  onBlur={onBlurBody}
                  onFocus={onFocusBody}
                  placeholder={"{\n  'some_property' : 'some value'\n}"}
                  extensions={[javascript()]}
                  plugins={[
                    {
                      name: 'customVars',
                      isModule: true,
                      decorationClass: 'code-tag code-editor-hl-formula',
                      options: {},
                      matchRegex: /\{\{\s*([^}}]*?)\s*\}\}/g,
                    },
                  ]}
                />
              </div>
            )}

            <div
              className={`flex flex-col hover:bg-gray-50 pt-2 pl-4 pr-4 ${activeFocusZone === 'certificate-file-zone' && 'bg-gray-50'} ${certFieldVisible ? 'pb-2' : 'pb-4'}`}
            >
              <div className="flex">
                <p className="font-normal text-xs mr-2 pb-1">Certificate file</p>
                <Switch size="small" defaultChecked={false} onClick={addCertificate} />
              </div>
              {certFieldVisible && (
                <Input
                  onBlur={onBlurCertificateFile}
                  onFocus={onFocusCertificateFile}
                  placeholder="Enter certificate file"
                  defaultValue=""
                ></Input>
              )}
            </div>
            {certFieldVisible && (
              <div
                className={`flex flex-col hover:bg-gray-50 pb-4 pt-2 pl-4 pr-4 ${activeFocusZone === 'key-file-zone' && 'bg-gray-50'}`}
              >
                <div className="w-full">
                  <p className="font-normal text-xs pb-1">Key file</p>
                </div>
                <div className="w-full">
                  <Input
                    onBlur={onBlurKeyFile}
                    onFocus={onFocusKeyFile}
                    placeholder="Enter key file"
                    defaultValue=""
                  ></Input>
                </div>
              </div>
            )}
            <div className="ml-4 mr-4">
              <Divider className="border-gray-100 mt-0 mb-0 pl-4 pr-4" />
            </div>

            <div
              className={`flex flex-row hover:bg-gray-50 pt-4 pb-4 pl-4 pr-4 ${activeFocusZone === 'output-variable-zone' && 'bg-gray-50'}`}
            >
              <p className="font-normal text-xs flex items-center whitespace-nowrap pr-3">
                Output Variable
              </p>
              <Input
                onBlur={onBlurOutputVariable}
                onFocus={onFocusOutputVariable}
                placeholder="Enter output variable"
                defaultValue=""
              ></Input>
            </div>
          </div>
        </div>

        <div className="footer-split-path pl-4 pr-4 pt-2 pb-2 flex justify-end">
          <div className="flex flex-row">
            <Button size="small" className="mr-1" onClick={stepTest}>
              {'Test'}
            </Button>
            <Button size="small" type="primary" onClick={stepSave}>
              {'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export const ApiCall = Template.bind({});
