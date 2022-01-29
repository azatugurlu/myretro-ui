import i18n from '@/lang/index'

export function getErrorMessage(messages) {

	var error = ''

	if (messages.length > 1) {
		messages.forEach(function(err){
			if (i18n.t('errors.'+err.code) != undefined && i18n.t('errors.'+err.code) != 'errors.'+err.code) {
			  	error +=  err.code + ': ' + i18n.t('errors.'+err.code) + ' '
			}else{
			  	error +=  err.code + ': ' + err.msg + ' '
			}
		})
	}else{
		var err = messages[0]
  		if (i18n.t('errors.'+err.code) != undefined && i18n.t('errors.'+err.code) != 'errors.'+err.code) {
		  	error =  err.code + ': ' + i18n.t('errors.'+err.code)
		}else{
		  	error =  err.code + ': ' + err.msg
		}
	}

	return error
}