<template>
	<div class="email-template-container">
		<Loader v-if="loader.isShow" :message="loader.message"/>
		<Header/>

		<div class="email-template-content px-4 pb-4 overflow-y-auto max-h-96">
			<div class="card flex p-4 pt-8">
				<div class="flex-1">

					<div class="relative text-gray-600 pb-2 px-2">
						<span class="text-sm font-bold">TYPE</span>
						<a href="#" class="text-sm absolute top-0 right-2" @click="toggleTemplateModals(true, 'add')">
							<font-awesome-icon icon="plus-square" class="mr-2" size="lg" /> Add
						</a>
					</div>

					<div class="scroll-container">
						<div 
							v-for="(list, index) in templatesArr" 
							:key="list.index" 
							:class="{'bg-gray-100 border-l border-r': list._id == activeTemplateId }"
							class="relative text-gray-600 border-t px-2 py-3 cursor-pointer relative"
							@click.prevent="selectTemplate(list)"
						>
							<span class="text-base">{{ list.type }}</span>

							<div v-if="list._id == activeTemplateId" class="absolute top-4 right-2 ">
								<font-awesome-icon icon="edit" class="ml-3 text-primaryMsg" @click="toggleTemplateModals(true, 'edit', index)"/>
								<font-awesome-icon icon="trash-alt" class="ml-3 text-dangerMsg" @click="removeTemplate()"/>
							</div>
						</div>
					</div>	

				</div>
				<div class="flex-2 pl-20 pb-20">
					<p class="text-xl text-center font-bold mb-8">Preview</p>

					<p class="text-base mb-2"><b class="mr-4">Subject :</b> {{ template.subject }}</p>
					<p class="text-base mb-8"><b class="mr-4">Image Url :</b> {{ template.image_url }}</p>

					<div v-html="template.content" class="leading-normal template-content"></div>
				</div>
			</div>
		</div>	

		<Modal 
			v-model="isShowAddTemplate" 
			title="Add Template"
			modal-class="modal-wrapper"
		>
			<AddTemplateModal :closeModal="toggleTemplateModals" :addTemplateSuccess="refreshData" :toggleLoader="toggleLoader"/>
		</Modal>

		<Modal 
			v-model="isShowEditTemplate" 
			title="Edit Template"
			modal-class="modal-wrapper w-9/10 max-w-none"
		>
			<EditTemplateModal :closeModal="toggleTemplateModals" :editTemplateSuccess="refreshData" :template="template" :toggleLoader="toggleLoader"/>
		</Modal>
	</div>
</template>

<style lang="scss" scoped>
	@import "./style.scss";
</style>

<script>
	import EmailTemplate from './function.vue'
	export default EmailTemplate
</script>