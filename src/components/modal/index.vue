<template>
  <div class="nexment-modal-replies">
    <modal
      name="repliesList"
      :adaptive="true"
      height="90vh"
      @closed="modalCloseHandler"
    >
      <div class="nexment-modal-header">
        <a @click="closeModal()">
          <Icons name="modalCancel" />
        </a>
      </div>
      <div>
        <RepliesList
          :dataContent="content"
          :replyToID="replyToID"
          :pageKey="pageKey"
          :replyToOID="replyToOID"
          :replyToName="replyToName"
          :replyItem="replyItem"
          :config="config"
          @refetchFunc="refetchData"
        />
      </div>
    </modal>
  </div>
</template>
<script lang="ts">
/** 
  Reply list modal
*/
import "@/assets/style/modal.scss";
import { defineComponent } from "@vue/composition-api";
import RepliesList from "@/components/sections/RepliesList.vue";
import Icons from "@/components/icons/index.vue";

export default defineComponent({
  name: "ReplyModal",
  props: {
    type: String,
    content: Object,
    replyTo: String,
    pageKey: String,
    replyToID: Number,
    replyToOID: String,
    replyToName: String,
    replyItem: Object,
    config: Object,
  },
  components: {
    RepliesList,
    Icons,
  },
  mounted() {
    this.$modal.show("repliesList");
  },
  methods: {
    closeModal() {
      this.$modal.hide("repliesList");
    },
    modalCloseHandler() {
      this.$emit("close", this.$props.replyToOID);
    },
    refetchData() {
      this.$emit("refetchFunc");
    },
  },
});
</script>
