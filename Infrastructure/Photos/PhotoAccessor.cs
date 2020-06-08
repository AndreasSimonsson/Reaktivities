using Application.Interfaces;
using Application.Photos;
using Microsoft.AspNetCore.Http;
using CloudinaryDotNet;
using Microsoft.Extensions.Options;
using CloudinaryDotNet.Actions;
using System;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;
        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            var account = new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public PhotoUploadResult AddPhoto(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();
            if(file.Length > 0)
            {
                using(var stream = file.OpenReadStream())
                {
                    var uploadsParams = new ImageUploadParams();
                    uploadsParams.File = new FileDescription(file.FileName, stream);
                    uploadsParams.Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face");
                    uploadResult = _cloudinary.Upload(uploadsParams);
                }
            }

            if(uploadResult.Error != null)
                throw new Exception(uploadResult.Error.Message);

            return new PhotoUploadResult{PublicId=uploadResult.PublicId, Url=uploadResult.SecureUrl.AbsoluteUri};
        }

        public string DeletePhoto(string publicId)
        {
            var deleteParams = new CloudinaryDotNet.Actions.DeletionParams(publicId);
            var result = _cloudinary.Destroy(deleteParams);
            return result.Result == "ok" ? result.Result : null;
        }
    }
}