import Reader from "./adapters/reader/types";
import APIException from "./apiException";
import FileNotFoundException from "./fileNotFoundException";

interface Line {
    weight: number;
    index: number;
    value: number;
}

class Packer {
    fileReader: Reader;

    /**
     * @param filePath path to the input file
     * @returns indices of the items to be packed
     */
    pack(filePath: string): Promise<string> {
        return this.processFile(filePath)
    }

    constructor(reader: Reader) {
        this.fileReader = reader
    }
    /**
     * processFile decodes input from the file and calculates the items to be picked.
     * It uses ReadStream so as to not overload the memory when the input file size is too large
     * @param filePath path to the file
     * @returns indices of the items to picked for optimal package
     */
    private processFile(filePath): Promise<string> {
        const lineReader = this.fileReader.CreateReadStream(filePath)
        const itemsToPack: number[][] = []

        return new Promise((resolve, reject) => {
            lineReader.on('line', (line: string) => {
                const [maxWeight, items] = this.getParamsFromLine(line)

                if (maxWeight > 100 || maxWeight < 0) {
                    reject(new APIException("package max weight constraint voilation"))
                }

                itemsToPack.push(this.getItemsIndicesToPick(maxWeight, items))
            })

            lineReader.on("close", () => {
                resolve(this.prepareOutput(itemsToPack))
            })

            lineReader.on("error", (err) => {
                if (err.code === "ENOENT") {
                    reject(new FileNotFoundException("invalid file input path"))
                }
                reject(err)
            })
        })
    }

    /**
     * getParamsFromLine decodes line and returns the weight and items available for picking
     * @param line is read from the input file
     * @returns weight and items to pick for the weight
     */
    private getParamsFromLine(line: string): [number, Line[]] {
        line = line.trim();
        line = line.replace(/ /g, "");

        let [maxWeight, otherParams] = line.split(":")

        const items: Line[] = []

        otherParams.split(")(").forEach(param => {
            param = param.replace(/\(|\)|€/g, "")
            const [index, weight, value] = param.split(",")
            items.push({ index: parseInt(index), weight: parseFloat(weight), value: parseFloat(value) })
        })

        return [parseInt(maxWeight), items]
    }

    /**
     * getItemsIndicesToPick finds the indices to pick for optimal weight.
     * @param maxWeight maximum weight knapsack can keep
     * @param items contain list of Line items with value, weight and index of the item
     * @returns list of indices to pick from the items that will make the optimal weight
     */
    private getItemsIndicesToPick(maxWeight: number, items: Line[]): number[] {
        const selected: number[] = new Array(items.length).fill(0)
        
        this.findOptimalItems(maxWeight, items.length, items, new Map(), selected)
        
        const pickedIndices: number[] = []
        selected.forEach((select, index) => {
            if (select) {
                pickedIndices.push(index + 1)
            }
        })
        return pickedIndices
    }

    /**
     * findOptimalItems selects the items that make up the most optimal weight for the knapsack.
     * Uses 0/1 knapsack recursive solution with memoization
     * @param maxWeight maximum weight knapsack can keep
     * @param size number of items to pick from
     * @param items contain list of Line items with value, weight and index of the item
     * @param memo memo is the memoization Map to not re-iterate over already solved sub problem
     * @param selected selected is the array to keep the track of selected item indices from the input items
     * @returns total weight that can be picked from the items without overflowing knapsack
     */
    private findOptimalItems(maxWeight: number, size: number, items: Line[], memo: Map<string, number>, selected: number[]): number {
        // Check maxWeight and beyond array size
        if (maxWeight === 0 || size === 0) {
            return 0;
        }

        // Key for map for memoization at each size+weight level
        const key = `${maxWeight}|${size}`;

        // We cannot load bigger than max weight item
        if (items[size - 1].weight > maxWeight) {
            return this.findOptimalItems(maxWeight, size - 1, items, memo, selected)
        } else {
            // If there is no solution for weight+size calculate else use the calculated value
            if (!memo.has(key)) {
                // pick current item
                // for remaining items (size-1) with reduced maxWeight (maxWeight - weights[size - 1])
                const currVisited = new Array(size).fill(0)
                currVisited[size - 1] = 1
                const withCurr = items[size - 1].value + this.findOptimalItems(maxWeight - items[size - 1].weight, size - 1, items, memo, currVisited);

                // Recurcive call for remaining items in reduced(size-1)
                const withoutCurrVisited = new Array(size).fill(0)
                const withoutCurr = this.findOptimalItems(maxWeight, size - 1, items, memo, withoutCurrVisited);

                // select the visited array from bigger value item
                if (withCurr >= withoutCurr) {
                    currVisited.forEach((val, index) => (selected[index] = val))
                } else {
                    withoutCurrVisited.forEach((val, index) => (selected[index] = val))
                }
                memo.set(key, Math.max(withCurr, withoutCurr));
            }
            return memo.get(key) as number;
        }
    }

    /**
     * @param itemsIndices 2d array that contains each packages items
     * @returns line delimited packages with comma separated item indices
     */
    private prepareOutput(itemsIndices: number[][]): string {
        const itemsToPack: string[] = []
        itemsIndices.forEach(indices => {
            itemsToPack.push(indices.join(",") || "-")
        })
        return itemsToPack.join("\n")
    }
}

export default Packer