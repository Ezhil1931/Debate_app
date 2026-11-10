import { createRef } from 'react';

// Android blur needs a ref to the view being blurred. One ref per tab screen,
// so the floating tab bar can blur whichever screen is currently showing.
const refs = {};
export const getBlurRef = (name) => (refs[name] ??= createRef());
