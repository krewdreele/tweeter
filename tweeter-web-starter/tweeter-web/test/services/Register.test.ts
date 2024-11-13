import { RegisterRequest } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade"
import "isomorphic-fetch";

test("Register", async () => {
    const serverFacade = new ServerFacade();

    const request: RegisterRequest = {
        firstName: "Abe",
        lastName: "Lincoln",
        userImageBase64: "",
        imageFileExtension: "",
        alias: "@therealabelincoln",
        password: "cherrytreez",
        token: ""
    }

    const [user, token] = await serverFacade.register(request);

    expect(user).toBeTruthy();
    expect(token).toBeTruthy();
})