import { BaseCodeEditorConfig, Optional } from '@components/BaseCodeEditor/types';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface IProps extends Optional<BaseCodeEditorConfig, 'placeholder' | 'theme'> {
    minHeightLines?: number,
    maxHeightLines?: number
}
