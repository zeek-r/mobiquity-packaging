## Knapsack Packaging API
---
## Problem

You want to send your friend a package with different things.
Each thing you put inside the package has such parameters as index number, weight and cost. The
package has a weight limit. Your goal is to determine which things to put into the package so that the
total weight is less than or equal to the package limit and the total cost is as large as possible.
You would prefer to send a package which weighs less in case there is more than one package with the
same price.

## Solution
- Taking a quick look at the problem statement, it is clear that it is a 0/1 knapsack problem.
- The solution presented here uses recursive approach with memoization.
- It uses an extra array for saving the indices of the optimally picked items.

### Step by Step
- The pack function takes a filepath as input.
- The pack function invokes a processFile function which
    - Creates a read stream to the file so as to not overload memory in case of large files.
    - Reads one line at a time.
    - Processes the line
- The line read is sent to getParamsFromLine() which extracts,
    - max weight knapsack can hold
    - items with index, weight and values
- The extracted params are then sent to getItemsIndicesToPick() function that,
    - checks values from end of the items list and decides whether or not to select the item.
    - saves the index of the item that is selected in an array filled with 0 for items not selected.
    - the array with selected index of the items is then returned.
- The item indices to be packed are then appended to another 2d array.
- The output formatted string is created from the items indices to be packed.

## Build and Test
---
### Pre-requisites
- node v1.18 and above
- tsc v5.1.3 and above
- jest v29.5 and above

### Build
---
> npm build // builds js to /dist dir

### Test
> npm test // runs test