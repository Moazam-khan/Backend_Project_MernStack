const asyncHandler = (requestHandler ) => {
  (req, res, next) => {
   Promise.resolve(requestHandler(req, res, next)).
   catch((error) => next (error))
  
  }
}

//const asyncHandler = () => {}
// const asyncHandler = (fn) =>  async () => {} or const asyncHandler = (fn) => {async() => {}}

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res
//       .status(error.code || 500)
//       .json({ success: false, message: error.message || "An error occurred" });
//   }
// };

export { asyncHandler };