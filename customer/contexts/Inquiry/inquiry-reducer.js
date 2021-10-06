const removeSelectedItems = (state, payload) => {
  let index = state.selectedItems.findIndex(
    (filter) => filter.ID == payload.ID
  );
  state.selectedItems.splice(index, 1);
  return [...state.selectedItems];
};

// helper fn for update item in add inquiry thirt step

const handleLoopUpdate = (
  selectedItmes,
  updatedItem,
  inputData,
  changeType
) => {
  if (changeType == "package") {
    // when package type update
    const checkIndex = selectedItmes.findIndex(
      (item) =>
        item.ID === updatedItem.ID &&
        item.PackageType == inputData?.PackageType?.[updatedItem.ID]
    );

    if (checkIndex > -1) {
      const existingCartItemIndex1 = selectedItmes.findIndex(
        (item) =>
          item.ID === updatedItem.ID &&
          item.PackageType == updatedItem.PackageType
      );
      let newState = [...selectedItmes];
      newState[existingCartItemIndex1] = {
        ...updatedItem,
        PackageType: inputData?.PackageType?.[updatedItem.ID],
      };

      newState.splice(checkIndex, 1);

      return newState;
    } else {
      const existingCartItemIndex1 = selectedItmes.findIndex(
        (item) =>
          item.ID === updatedItem.ID &&
          item.PackageType == updatedItem.PackageType
      );
      let newState = [...selectedItmes];
      newState[existingCartItemIndex1] = {
        ...updatedItem,
        PackageType: inputData?.PackageType?.[updatedItem.ID],
      };
      return newState;
    }
  } else {
    //when quantity, expectedDate, remarks upadate

    const checkIndex = selectedItmes.findIndex(
      (item) =>
        item.ID === updatedItem.ID &&
        item.PackageType == updatedItem.PackageType
    );

    if (checkIndex > -1) {
      let newState = [...selectedItmes];

      newState[checkIndex] = {
        ...updatedItem,
        Quantity: inputData?.Quantity?.[updatedItem.ID]
          ? inputData?.Quantity?.[updatedItem.ID]
          : updatedItem.Quantity,
        ExpectedDate: inputData?.ExpectedDate?.[updatedItem.ID]
          ? inputData?.ExpectedDate?.[updatedItem.ID]
          : updatedItem.ExpectedDate,
        Remarks: inputData?.Remarks?.[updatedItem.ID]
          ? inputData?.Remarks?.[updatedItem.ID]
          : updatedItem.Remarks,
      };

      return newState;
    }
  }
};

const addItemHandler = (state, payload) => {
  const { item, inputData, key, changeType } = payload;

  // console.log("key === ", key);
  // console.log("changeType === ", changeType);

  if (key == "update") {
    // when update inquiry item
    return handleLoopUpdate(state.selectedItems, item, inputData, changeType);
  }

  const existingSelectedItem = state.selectedItems.findIndex(
    (singleItem) =>
      singleItem.ID === item.ID &&
      singleItem.PackageType == inputData?.PackageType?.[item.ID]
  );

  if (existingSelectedItem > -1) {
    //if already in list then replace it with new item
    const newState = [...state.selectedItems];
    if (inputData?.Quantity?.[item.ID]) {
      newState[existingSelectedItem].Quantity = inputData?.Quantity?.[item.ID];
    }
    if (inputData?.PackageType?.[item.ID]) {
      newState[existingSelectedItem].PackageType =
        inputData?.PackageType?.[item.ID];
    }
    if (inputData?.ExpectedDate?.[item.ID]) {
      newState[existingSelectedItem].ExpectedDate =
        inputData?.ExpectedDate?.[item.ID];
    }
    if (inputData?.Remarks?.[item.ID]) {
      newState[existingSelectedItem].Remarks = inputData?.Remarks?.[item.ID];
    }
    return newState;
  }
  // add new item in selected list
  item.Quantity = inputData?.Quantity?.[item.ID];
  item.PackageType = inputData?.PackageType?.[item.ID];
  item.ExpectedDate = inputData?.ExpectedDate?.[item.ID];
  return [...state.selectedItems, { ...item }];
};

export const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "REHYDRATE":
      return { ...state, ...payload };
    case "ADD_ITEM":
      return { ...state, selectedItems: addItemHandler(state, payload) };
    case "REMOVE_ITEM":
      return { ...state, selectedItems: removeSelectedItems(state, payload) };
    case "EMPTY_SELECTED_ITEMS":
      return { ...state, selectedItems: [] };
    default:
      throw new Error(`Unknown action: ${type}`);
  }
};
