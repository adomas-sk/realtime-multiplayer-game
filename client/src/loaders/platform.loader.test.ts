import * as platform_loader from "./platform.loader"
// @ponicode
describe("platform_loader.loadPlatformSprite", () => {
    test("0", () => {
        let callFunction: any = () => {
            platform_loader.loadPlatformSprite(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
