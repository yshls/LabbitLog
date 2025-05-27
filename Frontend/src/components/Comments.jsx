import css from './comments.module.css'

export const Comments = () => {
  return (
    <section className={css.comments}>
      <p className={css.logMessage}> 댓글을 작성하려면 로그인을 필요합니다.</p>

      <form>
        <textarea placeholder="댓글을 입력하세요"></textarea>
        <button>댓글 등록</button>
      </form>
      <ul>
        <li className={css.list}>
          <div className={css.commnet}>
            <p className={css.author}>username</p>
            <p className={css.date}>2025-05-05</p>
            <p className={css.text}>
              로그인 한 사용자만 댓글을 작성할 수 있습니다. <br />
              댓글은 다른 사용자에게 보여지며, 작성자만 댓글을 수정하거나 삭제할 수 있습니다.
            </p>
          </div>
          <div className={css.btns}>
            <button>수정</button>
            <button>삭제</button>
          </div>
        </li>
      </ul>
    </section>
  )
}
