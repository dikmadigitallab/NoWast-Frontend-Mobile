type ItemType = 'ppe' | 'product' | 'tools' | 'transport';

const messages = {
  ppe: {
    create: {
      success: 'EPI criado com sucesso',
      error: 'Erro ao criar EPI',
    },
    update: {
      success: 'EPI atualizado com sucesso',
      error: 'Erro ao atualizar EPI',
    },
    delete: {
      success: 'EPI excluído com sucesso',
      error: 'Erro ao excluir EPI',
    },
  },
  product: {
    create: {
      success: 'Produto criado com sucesso',
      error: 'Erro ao criar produto',
    },
    update: {
      success: 'Produto atualizado com sucesso',
      error: 'Erro ao atualizar produto',
    },
    delete: {
      success: 'Produto excluído com sucesso',
      error: 'Erro ao excluir produto',
    },
  },
  tools: {
    create: {
      success: 'Equipamento criado com sucesso',
      error: 'Erro ao criar equipamento',
    },
    update: {
      success: 'Equipamento atualizado com sucesso',
      error: 'Erro ao atualizar equipamento',
    },
    delete: {
      success: 'Equipamento excluído com sucesso',
      error: 'Erro ao excluir equipamento',
    },
  },
  transport: {
    create: {
      success: 'Transporte criado com sucesso',
      error: 'Erro ao criar transporte',
    },
    update: {
      success: 'Transporte atualizado com sucesso',
      error: 'Erro ao atualizar transporte',
    },
    delete: {
      success: 'Transporte excluído com sucesso',
      error: 'Erro ao excluir transporte',
    },
  },
  default: {
    create: {
      success: 'Item criado com sucesso',
      error: 'Erro ao criar item',
    },
    update: {
      success: 'Item atualizado com sucesso',
      error: 'Erro ao atualizar item',
    },
    delete: {
      success: 'Item excluído com sucesso',
      error: 'Erro ao excluir item',
    },
  },
};

export const getToastMessageRequest = (type: ItemType, action: 'create' | 'update' | 'delete') => {
  return messages[type]?.[action] || messages.default[action];
};

