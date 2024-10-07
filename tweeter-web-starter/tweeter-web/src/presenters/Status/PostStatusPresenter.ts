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
  private view: PostStatusView;

  public constructor(view: PostStatusView) {
    this.view = view;
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
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.service.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }
}
