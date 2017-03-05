package feedback

//Idea represents an idea on a tenant board
type Idea struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}
