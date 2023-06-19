import Packer from "./packaging";
import FileReader from "./adapters/reader";
import APIException from "./apiException";
import FileNotFoundException from "./fileNotFoundException";

function setup(): Packer {
    return new Packer(new FileReader())
}
describe("Packer test", () => {
    it("should initialize packer correctly", () => {
        const packer = setup()
        expect(typeof packer.pack).toBe("function")
    })

    it("should run packer.pack correctly", async () => {
        const packer = setup()
        const items = await packer.pack("./testdata/example_input")

        expect(items).toEqual(`4\n-\n2,7\n8,9`)
    })

    it("should run packer.pack correctly for large input", async () => {
        const packer = setup()

        const items = await packer.pack("./testdata/example_input_large")

        expect(items).toEqual(`4\n-\n2,7\n9,10,11,12,13,14,15,16`)
    })

    it("should run throw api exception when weight bigger than 100", async () => {
        const packer = setup()

        try {
            await packer.pack("./testdata/example_input_api_exception")
        } catch (error) {
            expect(error instanceof APIException).toBe(true);
        }
    })

    it("should run throw api exception when weight bigger than 100", async () => {
        const packer = setup()

        try {
            await packer.pack("./testdata/example_input_negative_weight")
        } catch (error) {
            expect(error instanceof APIException).toBe(true);
        }
    })

    it("should run throw error exception when file path wrong", async () => {
        const packer = setup()

        try {
            await packer.pack("./testdata/example")
        } catch (error) {
            console.log(typeof error)
            expect(error instanceof FileNotFoundException).toBe(true);
        }
    })
})