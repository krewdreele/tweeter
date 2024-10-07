import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export interface PostStatusView {
  setIsLoading: (value: boolean) => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  setPost: (post: string) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
  clearLastInfoMessage: () => void;
}

export class PostStatusPresenter {
  private service: StatusService;
  private _view: PostStatusView;

  public constructor(view: PostStatusView) {
    this._view = view;
    this.service = new StatusService();
  }

  public async submitPost(
    event: React.MouseEvent,
    authToken: AuthToken,
    post: string,
    currentUser: User
  ) {
    event.preventDefault();

    try {
      this._view.setIsLoading(true);
      this._view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.service.postStatus(authToken!, status);

      this._view.setPost("");
      this._view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this._view.clearLastInfoMessage();
      this._view.setIsLoading(false);
    }
  }
}
