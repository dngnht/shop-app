<template>
  <!-- Modal -->
  <div class="modal" id="delete-modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Please confirm !</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            form-check
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">選択されたすべての商品を削除しますか?</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="deleteForce"
          >
            削除
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
            取り消し
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Delete",
  setup(props, { emit }) {
    const deleteForce = () => emit("handle-force-delete");
    return { deleteForce };
  },
};
</script>

<style></style>
