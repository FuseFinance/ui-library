jest.mock('reactflow', () => ({
  useReactFlow: jest.fn(() => ({
    setEdges: jest.fn(),
    setNodes: jest.fn(),
  })),
}));

jest.mock('@constants/env', () => ({
  FRONT_CLIENT: 'test-client',
  BE_URL: '',
}));

jest.mock('@react-querybuilder/antd', () => ({
  QueryBuilderAntD: () => null,
}));
