import Icon from '../components/Icons';
import { IconList } from '../components/Icons/types';
import colors from '../styles/colors';
import { NodeTypesEnum } from './types';

/* I'm not returning just the IconList prop since we also have
an external icon library. If we want to pass props to the returning
icon component we can use cloneElement() React function*/
export const getIconByNodeType = (nodeType: NodeTypesEnum) => {
  switch (nodeType) {
    case NodeTypesEnum.START:
      return <Icon icon={IconList.PlayCircle} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.FINISH:
      return <Icon icon={IconList.Stop} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.FORMULA_NODE:
      return <Icon icon={IconList.Fx} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.CONDITION_NODE:
      return <Icon icon={IconList.If} width="22px" fill={colors.fuseBlue3} />;

    case NodeTypesEnum.SPLIT_PATH_NODE:
      return <Icon icon={IconList.Branch} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.API_CALL_NODE:
      return <Icon icon={IconList.Plug} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.ASYNC_RESPONSE_NODE:
      return <Icon icon={IconList.AsyncResponse} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.CONDITION_TABLE_NODE:
      return <Icon icon={IconList.TableEdit} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.GO_TO:
      return <Icon icon={IconList.Merge} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.GROUP_START:
    case NodeTypesEnum.GROUP_END:
    case NodeTypesEnum.GROUP_NODE:
      return <Icon icon={IconList.Group} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.SUB_WORKFLOW:
      return <Icon icon={IconList.Workflow} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.CUSTOM_CODE:
      return <Icon icon={IconList.Code} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.CONVERTER:
      return <Icon icon={IconList.Converter} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.JSONATA:
      return <Icon icon={IconList.Jsonata} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.DB_QUERY:
    case NodeTypesEnum.DB_CONNECTION:
      return <Icon icon={IconList.DBQuery} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.ALERT:
      return <Icon icon={IconList.Bell} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.APP_STATUS_CHANGE:
      return <Icon icon={IconList.StatusChange} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.LOOP:
      return <Icon icon={IconList.Loop} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.S3_UPLOAD:
      return <Icon icon={IconList.Aws} fill={colors.fuseBlue3} />;

    case NodeTypesEnum.SFTP_UPLOAD:
      return <Icon icon={IconList.Upload} fill={colors.fuseBlue3} />;
    default:
      return null;
  }
};
