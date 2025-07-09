import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  { id: 1, name: 'Espresso', price: 3.5 },
  { id: 2, name: 'Latte', price: 4.5 },
];

const dishSlice = createSlice({
  name: 'dishes',
  initialState,
  reducers: {
    addDish: (state, action) => {
      state.push(action.payload);
    },
    updateDish: (state, action) => {
      const index = state.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteDish: (state, action) => {
      return state.filter(d => d.id !== action.payload);
    },
  },
});

export const { addDish, updateDish, deleteDish } = dishSlice.actions;
export default dishSlice.reducer;
