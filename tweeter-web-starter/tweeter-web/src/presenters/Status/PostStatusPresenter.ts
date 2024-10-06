import { AuthToken, Status, User } from "tweeter-shared";
import { PostService } from "../../model/service/PostService";

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
  private postService: PostService;
  private _view: PostStatusView;

  public constructor(view: PostStatusView) {
    this._view = view;
    this.postService = new PostService();
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

      await this.postService.postStatus(authToken!, status);

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
