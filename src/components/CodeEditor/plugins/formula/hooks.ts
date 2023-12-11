import { useEffect, useState } from 'react';

import { useGetFormulas } from '@/src/services/formulas';
import { arrayToPlainObject } from '@/src/components/Editor/FlowCanvas/utils';
import { formulaPlugin } from '../';

export const useFormulasEditorPlugin = () => {
  const [formulaEditorPlugin, setFormulaEditorPlugin] = useState({});
  const { formulas } = useGetFormulas();

  useEffect(() => {
    if (formulas?.length > 0) {
      const formulasFns = formulas.map((f) => `${f}()`);
      const formulasObj = arrayToPlainObject(formulasFns, 'Calcs');
      setFormulaEditorPlugin(formulaPlugin(formulasObj));
    }
  }, [formulas]);

  return {
    formulaEditorPlugin,
  };
};
